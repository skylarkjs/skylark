define([
    "./skylark",
    "./langx",
    "./noder",
    "./styles",
    "./geom",
    "./eventer"
], function(skylark,langx,noder,styles,geom,eventer) {

    var some = Array.prototype.some,
        stack = [],
        beginZIndex = 10000,
        idGen = 1;



    function close(elm,params){
        // summary:
        //      Close specified popup and any popups that it parented.
        //      If no popup is specified, closes all popups.

        var idx = -1;
        for (var i=stack.length-1;i>-1;i--) {
            if (stack[i].elm == elm) {
                idx = i;
                break;
            }
        }
        while (stack.length){
            var top = stack.pop(),
                widget = top.widget,
                onClose = top.onClose;

            if(widget.onClose){
                // TODO: in 2.0 standardize onHide() (used by StackContainer) and onClose() (used here).
                // Actually, StackContainer also calls onClose(), but to mean that the pane is being deleted
                // (i.e. that the TabContainer's tab's [x] icon was clicked)
                widget.onClose();
            }

            var h;
            while(h = top.handlers.pop()){
                h.remove();
            }

            // Hide the widget and it's wrapper unless it has already been destroyed in above onClose() etc.
            if(widget && widget.domNode){
                this.hide(widget);
            }

            if(onClose){
                onClose();
            }
            if (top == elm) {
                break;
            }
        }

        if(stack.length == 0 && this._aroundMoveListener){
            clearTimeout(this._aroundMoveListener);
            this._firstAroundNode = this._firstAroundPosition = this._aroundMoveListener = null;
        }
    }

    function open(elm,args) {

        while(stack.length && (!args.parent || !noder.contains(args.parent.domNode, stack[stack.length - 1].widget.domNode))){
            this.close(stack[stack.length - 1].widget);
        }

        var stack = this._stack,
            widget = args.popup,
            node = widget.domNode,
            orient = args.orient || ["below", "below-alt", "above", "above-alt"],
            ltr = args.parent ? args.parent.isLeftToRight() : domGeometry.isBodyLtr(widget.ownerDocument),
            around = args.around,
            id = (args.around && args.around.id) ? (args.around.id + "_dropdown") : ("popup_" + this._idGen++);

        // If we are opening a new popup that isn't a child of a currently opened popup, then
        // close currently opened popup(s).   This should happen automatically when the old popups
        // gets the _onBlur() event, except that the _onBlur() event isn't reliable on IE, see [22198].
        while(stack.length && (!args.parent || !dom.isDescendant(args.parent.domNode, stack[stack.length - 1].widget.domNode))){
            this.close(stack[stack.length - 1].widget);
        }

        // Get pointer to popup wrapper, and create wrapper if it doesn't exist.  Remove display:none (but keep
        // off screen) so we can do sizing calculations.
        var wrapper = this.moveOffScreen(widget);

        if(widget.startup && !widget._started){
            widget.startup(); // this has to be done after being added to the DOM
        }

        // Limit height to space available in viewport either above or below aroundNode (whichever side has more
        // room), adding scrollbar if necessary. Can't add scrollbar to widget because it may be a <table> (ex:
        // dijit/Menu), so add to wrapper, and then move popup's border to wrapper so scroll bar inside border.
        var maxHeight, popupSize = domGeometry.position(node);
        if("maxHeight" in args && args.maxHeight != -1){
            maxHeight = args.maxHeight || Infinity; // map 0 --> infinity for back-compat of _HasDropDown.maxHeight
        }else{
            var viewport = Viewport.getEffectiveBox(this.ownerDocument),
                aroundPos = around ? domGeometry.position(around, false) : {y: args.y - (args.padding||0), h: (args.padding||0) * 2};
            maxHeight = Math.floor(Math.max(aroundPos.y, viewport.h - (aroundPos.y + aroundPos.h)));
        }
        if(popupSize.h > maxHeight){
            // Get style of popup's border.  Unfortunately domStyle.get(node, "border") doesn't work on FF or IE,
            // and domStyle.get(node, "borderColor") etc. doesn't work on FF, so need to use fully qualified names.
            var cs = domStyle.getComputedStyle(node),
                borderStyle = cs.borderLeftWidth + " " + cs.borderLeftStyle + " " + cs.borderLeftColor;
            domStyle.set(wrapper, {
                overflowY: "scroll",
                height: maxHeight + "px",
                border: borderStyle // so scrollbar is inside border
            });
            node._originalStyle = node.style.cssText;
            node.style.border = "none";
        }

        domAttr.set(wrapper, {
            id: id,
            style: {
                zIndex: this._beginZIndex + stack.length
            },
            "class": "dijitPopup " + (widget.baseClass || widget["class"] || "").split(" ")[0] + "Popup",
            dijitPopupParent: args.parent ? args.parent.id : ""
        });

        if(stack.length == 0 && around){
            // First element on stack. Save position of aroundNode and setup listener for changes to that position.
            this._firstAroundNode = around;
            this._firstAroundPosition = domGeometry.position(around, true);
            this._aroundMoveListener = setTimeout(lang.hitch(this, "_repositionAll"), 50);
        }

        if(has("config-bgIframe") && !widget.bgIframe){
            // setting widget.bgIframe triggers cleanup in _WidgetBase.destroyRendering()
            widget.bgIframe = new BackgroundIframe(wrapper);
        }

        // position the wrapper node and make it visible
        var layoutFunc = widget.orient ? lang.hitch(widget, "orient") : null,
            best = around ?
                place.around(wrapper, around, orient, ltr, layoutFunc) :
                place.at(wrapper, args, orient == 'R' ? ['TR', 'BR', 'TL', 'BL'] : ['TL', 'BL', 'TR', 'BR'], args.padding,
                    layoutFunc);

        wrapper.style.visibility = "visible";
        node.style.visibility = "visible";  // counteract effects from _HasDropDown

        var handlers = [];

        // provide default escape and tab key handling
        // (this will work for any widget, not just menu)
        handlers.push(on(wrapper, "keydown", lang.hitch(this, function(evt){
            if(evt.keyCode == keys.ESCAPE && args.onCancel){
                evt.stopPropagation();
                evt.preventDefault();
                args.onCancel();
            }else if(evt.keyCode == keys.TAB){
                evt.stopPropagation();
                evt.preventDefault();
                var topPopup = this.getTopPopup();
                if(topPopup && topPopup.onCancel){
                    topPopup.onCancel();
                }
            }
        })));

        // watch for cancel/execute events on the popup and notify the caller
        // (for a menu, "execute" means clicking an item)
        if(widget.onCancel && args.onCancel){
            handlers.push(widget.on("cancel", args.onCancel));
        }

        handlers.push(widget.on(widget.onExecute ? "execute" : "change", lang.hitch(this, function(){
            var topPopup = this.getTopPopup();
            if(topPopup && topPopup.onExecute){
                topPopup.onExecute();
            }
        })));

        stack.push({
            widget: widget,
            wrapper: wrapper,
            parent: args.parent,
            onExecute: args.onExecute,
            onCancel: args.onCancel,
            onClose: args.onClose,
            handlers: handlers
        });

        if(widget.onOpen){
            // TODO: in 2.0 standardize onShow() (used by StackContainer) and onOpen() (used here)
            widget.onOpen(best);
        }

        return best;
    }

    function popup() {
        return popup;
    }

    langx.mixin(popup, {

    });


    return skylark.popup = popup;
});

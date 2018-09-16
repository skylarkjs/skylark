define([
    "./skylark",
    "./langx",
    "./datax",
    "./dnd",
    "./eventer",
    "./filer",
    "./finder",
    "./fx",
    "./geom",
    "./noder",
    "./styler"
], function(skylark, langx, datax, dnd, eventer, filer, finder, fx, geom, noder, styler) {
    var map = Array.prototype.map,
        slice = Array.prototype.slice;
    /*
     * VisualElement is a skylark class type wrapping a visule dom node,provides a number of prototype methods and supports chain calls.
     */
    var VisualElement = langx.klass({
        klassName: "VisualElement",

        "init": function(node) {
            if (langx.isString(node)) {
                node = document.getElementById(node);
            }
            this.domNode = node;
        }
    });
    /*
     * the VisualElement object wrapping document.body
     */
    var root = new VisualElement(document.body),
        velm = function(node) {
            if (node) {
                return new VisualElement(node);
            } else {
                return root;
            }
        };
    /*
     * Extend VisualElement prototype with wrapping the specified methods.
     * @param {ArrayLike} fn
     * @param {Object} context
     */
    function _delegator(fn, context) {
        return function() {
            var self = this,
                elem = self.domNode,
                ret = fn.apply(context, [elem].concat(slice.call(arguments)));

            if (ret) {
                if (ret === context) {
                    return self;
                } else {
                    if (ret instanceof HTMLElement) {
                        ret = new VisualElement(ret);
                    } else if (langx.isArrayLike(ret)) {
                        ret = map.call(ret, function(el) {
                            if (el instanceof HTMLElement) {
                                return new VisualElement(ret);
                            } else {
                                return el;
                            }
                        })
                    }
                }
            }
            return ret;
        };
    }

    langx.mixin(velm, {
        batch: function(nodes, action, args) {
            nodes.forEach(function(node) {
                var elm = (node instanceof VisualElement) ? node : velm(node);
                elm[action].apply(elm, args);
            });

            return this;
        },

        root: new VisualElement(document.body),

        VisualElement: VisualElement,

        partial: function(name, fn) {
            var props = {};

            props[name] = fn;

            VisualElement.partial(props);
        },

        delegate: function(names, context) {
            var props = {};

            names.forEach(function(name) {
                props[name] = _delegator(context[name], context);
            });

            VisualElement.partial(props);
        }
    });

    // from ./datax
    velm.delegate([
        "attr",
        "data",
        "prop",
        "removeAttr",
        "removeData",
        "text",
        "val"
    ], datax);

    // from ./dnd
    velm.delegate([
        "draggable",
        "droppable"
    ], dnd);


    // from ./eventer
    velm.delegate([
        "off",
        "on",
        "one",
        "shortcuts",
        "trigger"
    ], eventer);

    // from ./filer
    velm.delegate([
        "picker",
        "dropzone"
    ], filer);

    // from ./finder
    velm.delegate([
        "ancestor",
        "ancestors",
        "children",
        "descendant",
        "find",
        "findAll",
        "firstChild",
        "lastChild",
        "matches",
        "nextSibling",
        "nextSiblings",
        "parent",
        "previousSibling",
        "previousSiblings",
        "siblings"
    ], finder);

    /*
     * find a dom element matched by the specified selector.
     * @param {String} selector
     */
    velm.find = function(selector) {
        if (selector === "body") {
            return this.root;
        } else {
            return this.root.descendant(selector);
        }
    };

    // from ./fx
    velm.delegate([
        "animate",
        "fadeIn",
        "fadeOut",
        "fadeTo",
        "fadeToggle",
        "hide",
        "scrollToTop",
        "show",
        "toggle"
    ], fx);


    // from ./geom
    velm.delegate([
        "borderExtents",
        "boundingPosition",
        "boundingRect",
        "clientHeight",
        "clientSize",
        "clientWidth",
        "contentRect",
        "height",
        "marginExtents",
        "offsetParent",
        "paddingExtents",
        "pagePosition",
        "pageRect",
        "relativePosition",
        "relativeRect",
        "scrollIntoView",
        "scrollLeft",
        "scrollTop",
        "size",
        "width"
    ], geom);

    // from ./mover
    velm.delegate([
        "draggable",
        "droppable"
    ], dnd);


    // from ./noder
    velm.delegate([
        "after",
        "append",
        "before",
        "clone",
        "contains",
        "contents",
        "empty",
        "html",
        "isChildOf",
        "ownerDoc",
        "prepend",
        "remove",
        "removeChild",
        "replace",
        "reverse",
        "throb",
        "traverse",
        "wrapper",
        "wrapperInner",
        "unwrap"
    ], noder);

    // from ./styler
    velm.delegate([
        "addClass",
        "className",
        "css",
        "hasClass",
        "hide",
        "isInvisible",
        "removeClass",
        "show",
        "toggleClass"
    ], styler);

    // properties

    var properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
    'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
    'background', 'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex' ];

    properties.forEach( function ( property ) {

        var method = property;

        Velm.prototype[ method ] = function (value) {

            this.css( property, value );

            return this;

        };

    });

    // events
    var events = [ 'keyUp', 'keyDown', 'mouseOver', 'mouseOut', 'click', 'dblClick', 'change' ];

    events.forEach( function ( event ) {

        var method = event;

        Velm.prototype[ method ] = function ( callback ) {

            this.on( event.toLowerCase(), callback);

            return this;
        };

    });

    return skylark.velm = velm;
});
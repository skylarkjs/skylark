define([
    "./skylark",
    "./langx",
    "./noder",
    "./datax",
    "./finder",
    "./geom",
    "./eventer",
    "./mover",
    "./styler",
    "./query"
],function(skylark, langx,noder,datax,finder,geom,eventer,mover,styler,$){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;



    function resizable(elm, params) {

        var defaultOptions = {
            // prevents browser level actions like forward back gestures
            touchActionNone: true,

            direction : {
                top: false, 
                left: false, 
                right: true, 
                bottom: true
            },
            // selector for handle that starts dragging
            handle : {
                border : true,
                grabber: "",
                selector: true
            }
        };

        params = params || {};
        var handle = params.handle || {},
            handleEl,
            direction = params.direction || defaultOptions.direction,
            startSize,
            currentSize,
            startedCallback = params.started,
            movingCallback = params.moving,
            stoppedCallback = params.stopped;

        if (langx.isString(handle)) {
            handleEl = finder.find(elm,handle);
        } else if (langx.isHtmlNode(handle)) {
            handleEl = handle;
        }
        mover.movable(handleEl,{
            auto : false,
            started : function(e) {
                startSize = geom.size(elm);
                if (startedCallback) {
                    startedCallback(e);
                }
            },
            moving : function(e) {
                currentSize = {
                };
                if (direction.left || direction.right) {
                    currentSize.width = startSize.width + e.deltaX;
                } else {
                    currentSize.width = startSize.width;
                }

                if (direction.top || direction.bottom) {
                    currentSize.height = startSize.height + e.deltaY;
                } else {
                    currentSize.height = startSize.height;
                }

                geom.size(elm,currentSize);

                if (movingCallback) {
                    movingCallback(e);
                }
            },
            stopped: function(e) {
                if (stoppedCallback) {
                    stoppedCallback(e);
                }                
            }
        });
        
        return {
            // destroys the dragger.
            remove: function() {
                eventer.off(handleEl);
            }
        }

    }

    $.fn.resizable = function(params) {
        this.each(function(el){
            resizable(this,params);
        });
    };

    function resizer(){
      return resizer;
    }

    langx.mixin(resizer, {
        resizable: resizable
    });

    return skylark.resizer = resizer;
});

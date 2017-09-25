define([
    "./skylark",
    "./langx",
    "./noder",
    "./datax",
    "./geom",
    "./eventer",
    "./styler"
],function(skylark, langx,noder,datax,geom,eventer,styler){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height;


    function movable(elm, params) {
        function updateWithTouchData(e) {
            var keys, i;

            if (e.changedTouches) {
                keys = "screenX screenY pageX pageY clientX clientY".split(' ');
                for (i = 0; i < keys.length; i++) {
                    e[keys[i]] = e.changedTouches[0][keys[i]];
                }
            }
        }

        params = params || {};
        var handleEl = params.handle || elm,
            constraints = params.constraints,
            overlayDiv,
            doc = params.document || document,
            downButton,
            start,
            stop,
            drag,
            startX,
            startY,
            originalPos,
            size,
            startedCallback = params.started,
            movingCallback = params.moving,
            stoppedCallback = params.stopped,

            start = function(e) {
                var docSize = geom.getDocumentSize(doc),
                    cursor;

                updateWithTouchData(e);

                e.preventDefault();
                downButton = e.button;
                //handleEl = getHandleEl();
                startX = e.screenX;
                startY = e.screenY;

                originalPos = geom.relativePosition(elm);
                size = geom.size(elm);

                // Grab cursor from handle so we can place it on overlay
                cursor = styler.css(handleEl, "curosr");

                overlayDiv = noder.createElement("div");
                styler.css(overlayDiv, {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: docSize.width,
                    height: docSize.height,
                    zIndex: 0x7FFFFFFF,
                    opacity: 0.0001,
                    cursor: cursor
                });
                noder.append(doc.body, overlayDiv);

                eventer.on(doc, "mousemove touchmove", move).on(doc, "mouseup touchend", stop);

                if (startedCallback) {
                    startedCallback(e);
                }
            },

            move = function(e) {
                updateWithTouchData(e);

                if (e.button !== 0) {
                    return stop(e);
                }

                e.deltaX = e.screenX - startX;
                e.deltaY = e.screenY - startY;

                var l = originalPos.left + e.deltaX,
                    t = originalPos.top + e.deltaY;
                if (constraints) {

                    if (l < constraints.minX) {
                        l = constraints.minX;
                    }

                    if (l > constraints.maxX) {
                        l = constraints.maxX;
                    }

                    if (t < constraints.minY) {
                        t = constraints.minY;
                    }

                    if (t > constraints.maxY) {
                        t = constraints.maxY;
                    }
                }
                geom.relativePosition(elm, {
                    left: l,
                    top: t
                })

                e.preventDefault();
                if (movingCallback) {
                    movingCallback(e);
                }
            },

            stop = function(e) {
                updateWithTouchData(e);

                eventer.off(doc, "mousemove touchmove", move).off(doc, "mouseup touchend", stop);

                noder.remove(overlayDiv);

                if (stoppedCallback) {
                    stoppedCallback(e);
                }
            };

        eventer.on(handleEl, "mousedown touchstart", start);

        return {
            // destroys the dragger.
            remove: function() {
                eventer.off(handleEl);
            }
        }
    }

    function mover(){
      return mover;
    }

    langx.mixin(mover, {

        movable: movable

    });

    return skylark.mover = mover;
});

define([
    "./skylark",
    "./langx",
    "./noder",
    "./datax",
    "./finder",
    "./geom",
    "./eventer",
    "./styler"
],function(skylark, langx,noder,datax,finder,geom,eventer,styler){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height;


    var DndManager = langx.Evented.inherit({
      klassName : "DndManager",

      init : function() {

      },

      prepare : function(draggable) {
          var e = eventer.create("preparing",{
             dragSource : draggable.elm,
             handleElm : draggable.handleElm
          });
          draggable.trigger(e);
          draggable.dragSource = e.dragSource;
      },

      start : function(draggable,event) {

        var p = geom.pagePosition(draggable.elm);
        this.draggingOffsetX = parseInt(event.pageX - p.left);
        this.draggingOffsetY = parseInt(event.pageY - p.top)

        var e = eventer.create("started",{
          elm : draggable.elm,
          dragSource : draggable.dragSource,
          handleElm : draggable.handleElm,
          ghost : null,

          transfer : {
          }
        });

        draggable.trigger(e);


        this.dragging = draggable;

        if (draggable.draggingClass) {
          styler.addClass(draggable.dragSource,draggable.draggingClass);
        }

        this.draggingGhost = e.ghost;
        if (!this.draggingGhost) {
          this.draggingGhost = draggable.elm;
        }

        this.draggingTransfer = e.transfer;
        if (this.draggingTransfer) {

            langx.each(this.draggingTransfer,function(key,value){
                event.dataTransfer.setData(key, value);
            });
        }

        event.dataTransfer.setDragImage(this.draggingGhost, this.draggingOffsetX, this.draggingOffsetY);

        event.dataTransfer.effectAllowed = "copyMove";

        this.trigger(e);
      },

      over : function() {

      },

      end : function(dropped) {
        var dragging = this.dragging;
        if (dragging) {
          if (dragging.draggingClass) {
            styler.removeClass(dragging.dragSource,dragging.draggingClass);
          }
        }

        var e = eventer.create("ended",{
        });        
        this.trigger(e);


        this.dragging = null;
        this.draggingTransfer = null;
        this.draggingGhost = null;
        this.draggingOffsetX = null;
        this.draggingOffsetY = null;
      }
    });

    var manager = new DndManager(),
        draggingHeight,
        placeholders = [];



    var Draggable = langx.Evented.inherit({
      klassName : "Draggable",

      init : function (elm,params) {
        var self = this;

        self.elm = elm;
        self.draggingClass = params.draggingClass || "dragging",
        self._params = params;

        ["preparing","started", "ended", "moving"].forEach(function(eventName) {
            if (langx.isFunction(params[eventName])) {
                self.on(eventName, params[eventName]);
            }
        });


        eventer.on(elm,{
          "mousedown" : function(e) {
            if (params.handle) {
              self.handleElm = finder.closest(e.target,params.handle);
              if (!self.handleElm) {
                return;
              }
            }
            manager.prepare(self);
            if (self.dragSource) {
              datax.prop(self.dragSource, "draggable", true);
            }
          },

          "mouseup" :   function(e) {
            if (self.dragSource) {
              datax.prop(self.dragSource, "draggable", false);
              self.dragSource = null;
              self.handleElm = null;
            }
          },

          "dragstart":  function(e) {
            datax.prop(self.dragSource, "draggable", false);
            manager.start(self, e);
          },

          "dragend":   function(e){
            eventer.stop(e);

            if (!manager.dragging) {
              return;
            }

            manager.end(false);
          }
        });

      }

    });


    var Droppable = langx.Evented.inherit({
      klassName : "Droppable",

      init : function(elm,params) {
        var self = this,
            draggingClass = params.draggingClass || "dragging",
            hoverClass,
            activeClass,
            acceptable = true;

        self.elm = elm;
        self._params = params;

        ["started","entered", "leaved", "dropped","overing"].forEach(function(eventName) {
            if (langx.isFunction(params[eventName])) {
                self.on(eventName, params[eventName]);
            }
        });

        eventer.on(elm,{
          "dragover" : function(e) {
            e.stopPropagation()

            if (!acceptable) {
              return
            }

            var e2 = eventer.create("overing",{
                overElm : e.target,
                transfer : manager.draggingTransfer,
                acceptable : true
            });
            self.trigger(e2);

            if (e2.acceptable) {
              e.preventDefault() // allow drop

              e.dataTransfer.dropEffect = "copyMove";
            }

          },

          "dragenter" :   function(e) {
            var params = self._params,
                elm = self.elm;

            var e2 = eventer.create("entered",{
                transfer : manager.draggingTransfer
            });

            self.trigger(e2);

            e.stopPropagation()

            if (hoverClass && acceptable) {
              styler.addClass(elm,hoverClass)
            }
          },

          "dragleave":  function(e) {
            var params = self._params,
                elm = self.elm;
            if (!acceptable) return false
            
            var e2 = eventer.create("leaved",{
                transfer : manager.draggingTransfer
            });
            
            self.trigger(e2);

            e.stopPropagation()

            if (hoverClass && acceptable) {
              styler.removeClass(elm,hoverClass);
            }
          },

          "drop":   function(e){
            var params = self._params,
                elm = self.elm;

            eventer.stop(e); // stops the browser from redirecting.

            if (!manager.dragging) return

           // manager.dragging.elm.removeClass('dragging');

            if (hoverClass && acceptable) {
              styler.addClass(elm,hoverClass)
            }

            var e2 = eventer.create("dropped",{
                transfer : manager.draggingTransfer
            });

            self.trigger(e2);

            manager.end(true)
          }
        });

        manager.on("started",function(e){
            var e2 = eventer.create("started",{
                transfer : manager.draggingTransfer,
                acceptable : false
            });

            self.trigger(e2);

            acceptable = e2.acceptable;
            hoverClass = e2.hoverClass;
            activeClass = e2.activeClass;

            if (activeClass && acceptable) {
              styler.addClass(elm,activeClass);
            }

         }).on("ended" , function(e){
            var e2 = eventer.create("ended",{
                transfer : manager.draggingTransfer,
                acceptable : false
            });

            self.trigger(e2);

            if (hoverClass && acceptable) {
              styler.removeClass(elm,hoverClass);
            }
            if (activeClass && acceptable) {
              styler.removeClass(elm,activeClass);
            }

            acceptable = false;
            activeClass = null;
            hoverClass = null;
        });

      }
    });


    function draggable(elm, params) {
      return new Draggable(elm,params);
    }

    function droppable(elm, params) {
      return new Droppable(elm,params);
    }

    function dnd(){
      return dnd;
    }

    langx.mixin(dnd, {
       //params ： {
        //  target : Element or string or function
        //  handle : Element
        //  copy : boolean
        //  placeHolder : "div"
        //  hoverClass : "hover"
        //  start : function
        //  enter : function
        //  over : function
        //  leave : function
        //  drop : function
        //  end : function
        //
        //
        //}
        draggable   : draggable,

        //params ： {
        //  accept : string or function
        //  placeHolder
        //
        //
        //
        //}
        droppable : droppable,

        manager : manager


    });

    return skylark.dnd = dnd;
});

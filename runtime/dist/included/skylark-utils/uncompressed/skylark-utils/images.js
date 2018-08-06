define([
    "./skylark",
    "./langx",
    "./noder",
    "./geom",
    "./styler",
    "./datax",
    "./transforms",
    "./query"
], function(skylark,langx,noder,geom,styler,datax,transforms,$) {

  var elementNodeTypes = {
    1: true,
    9: true,
    11: true
  };

  var ImagesLoaded = langx.Evented.inherit({
   /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
    init : function(elem, options, onAlways) {
      // use elem as selector string
      if ( typeof elem == 'string' ) {
        elem = document.querySelectorAll( elem );
      }

      this.elements = langx.makeArray( elem );
      this.options = langx.mixin( {}, this.options );

      if ( typeof options == 'function' ) {
        onAlways = options;
      } else {
        langx.mixin( this.options, options );
      }

      if ( onAlways ) {
        this.on( 'always', onAlways );
      }

      this.getImages();

     // HACK check async to allow time to bind listeners
      setTimeout( function() {
        this.check();
      }.bind( this ));

    },

    options : {},

    getImages : function() {
      this.images = [];

      // filter & find items if we have an item selector
      this.elements.forEach( this.addElementImages, this );
    },

    /**
     * @param {Node} element
     */
    addElementImages : function( elem ) {
      // filter siblings
      if ( elem.nodeName == 'IMG' ) {
        this.addImage( elem );
      }
      // get background image on element
      if ( this.options.background === true ) {
        this.addElementBackgroundImages( elem );
      }

      // find children
      // no non-element nodes, #143
      var nodeType = elem.nodeType;
      if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
        return;
      }
      var childImgs = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var i=0; i < childImgs.length; i++ ) {
        var img = childImgs[i];
        this.addImage( img );
      }

      // get child background images
      if ( typeof this.options.background == 'string' ) {
        var children = elem.querySelectorAll( this.options.background );
        for ( i=0; i < children.length; i++ ) {
          var child = children[i];
          this.addElementBackgroundImages( child );
        }
      }
    },

    addElementBackgroundImages : function( elem ) {
      var style = getComputedStyle( elem );
      if ( !style ) {
        // Firefox returns null if in a hidden iframe https://bugzil.la/548397
        return;
      }
      // get url inside url("...")
      var reURL = /url\((['"])?(.*?)\1\)/gi;
      var matches = reURL.exec( style.backgroundImage );
      while ( matches !== null ) {
        var url = matches && matches[2];
        if ( url ) {
          this.addBackground( url, elem );
        }
        matches = reURL.exec( style.backgroundImage );
      }
    },

    /**
     * @param {Image} img
     */
    addImage : function( img ) {
      var loadingImage = new LoadingImage( img );
      this.images.push( loadingImage );
    },

    addBackground : function( url, elem ) {
      var background = new PreloadImage( url, elem );
      this.images.push( background );
    },

    check : function() {
      var _this = this;
      this.progressedCount = 0;
      this.hasAnyBroken = false;
      // complete if no images
      if ( !this.images.length ) {
        this.complete();
        return;
      }

      function onProgress( e ) {
        // HACK - Chrome triggers event before object properties have changed. #83
        setTimeout( function() {
          _this.progress( e );
        });
      }

      this.images.forEach( function( loadingImage ) {
        loadingImage.one( 'progress', onProgress );
        loadingImage.check();
      });
    },

    progress : function( e ) {

      this.progressedCount++;
      this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
      // progress event
      this.trigger( langx.createEvent('progress', {
        img : e.img,
        element : e.element,
        message : e.message,
        isLoaded : e.isLoaded
      }));

      // check if completed
      if ( this.progressedCount == this.images.length ) {
        this.complete();
      }

      if ( this.options.debug && console ) {
        console.log( 'progress: ' + message, e.target, e.element );
      }
    },

    complete : function() {
      var eventName = this.hasAnyBroken ? 'fail' : 'done';
      this.isComplete = true;
      this.trigger(langx.createEvent(eventName,{
        images : this.images
      }));
    }

  });
 

  // --------------------------  -------------------------- //

  var LoadingImage = langx.Evented.inherit({
    init: function( img ) {
      this.img = img;
    },
    check : function() {
      // If complete is true and browser supports natural sizes,
      // try to check for image status manually.
      var isComplete = this.getIsImageComplete();
      if ( isComplete ) {
        // report based on naturalWidth
        this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
        return;
      }

      // If none of the checks above matched, simulate loading on detached element.
      this.proxyImage = new Image();
      this.proxyImage.addEventListener( 'load', this );
      this.proxyImage.addEventListener( 'error', this );
      // bind to image as well for Firefox. #191
      this.img.addEventListener( 'load', this );
      this.img.addEventListener( 'error', this );
      this.proxyImage.src = this.img.src;
    },

    getIsImageComplete : function() {
      return this.img.complete && this.img.naturalWidth !== undefined;
    },

    confirm : function( isLoaded, message ) {
      this.isLoaded = isLoaded;
      this.trigger( langx.createEvent('progress', {
        img : this.img, 
        element : this.img,
        message : message ,
        isLoaded : isLoaded
      }));
    },
 // ----- events ----- //
    // trigger specified handler for event type
    handleEvent : function( event ) {
      var method = 'on' + event.type;
      if ( this[ method ] ) {
        this[ method ]( event );
      }
    },

    onload : function() {
      this.confirm( true, 'onload' );
      this.unbindEvents();
    },

    onerror : function() {
      this.confirm( false, 'onerror' );
      this.unbindEvents();
    },

    unbindEvents : function() {
      this.proxyImage.removeEventListener( 'load', this );
      this.proxyImage.removeEventListener( 'error', this );
      this.img.removeEventListener( 'load', this );
      this.img.removeEventListener( 'error', this );
    },

  });


  // -------------------------- PreloadImage -------------------------- //
  var PreloadImage = LoadingImage.inherit({

    init : function( url, element ) {
      this.url = url;
      this.element = element;
      this.img = new Image();
    },

    check : function() {
      this.img.addEventListener( 'load', this );
      this.img.addEventListener( 'error', this );
      this.img.src = this.url;
      // check if image is already complete
      var isComplete = this.getIsImageComplete();
      if ( isComplete ) {
        this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
        this.unbindEvents();
      }
    },

    unbindEvents : function() {
      this.img.removeEventListener( 'load', this );
      this.img.removeEventListener( 'error', this );
    },

    confirm : function( isLoaded, message ) {
      this.isLoaded = isLoaded;
      this.trigger( langx.createEvent('progress', {
        img : this.img,
        element : this.element, 
        message : message,
        isLoaded : isLoaded 
      }));
    }
  });

  function loaded(el,options, callback ) {
      var inst = new ImagesLoaded( el, options, callback );

      var d = new langx.Deferred();
      
      inst.on("progress",function(e){
        d.progress(e);
      });

      inst.on("done",function(e){
        d.resolve(e.images);
      });

      inst.on("fail",function(e){
        d.reject(e);
      });

      return d.promise;
  }

  function preload(urls,options) {

  }

  $.fn.imagesLoaded = function( options, callback ) {
      return loaded(this,options,callback);
  };


  function viewer(el,options) {
    var img ,
        style = {},
        clientSize = geom.clientSize(el),
        loadedCallback = options.loaded,
        faileredCallback = options.failered;

    function onload() {
        styler.css(img,{//居中
          top: (clientSize.height - img.offsetHeight) / 2 + "px",
          left: (clientSize.width - img.offsetWidth) / 2 + "px"
        });

        transforms.reset(img);

        styler.css(img,{
          visibility: "visible"
        });

        if (loadedCallback) {
          loadedCallback();
        }
    }

    function onerror() {

    }
    function _init() {
      style = styler.css(el,["position","overflow"]);
      if (style.position != "relative" && style.position != "absolute") { 
        styler.css(el,"position", "relative" );
      }
      styler.css(el,"overflow", "hidden" );

      img = new Image();

      styler.css(img,{
        position: "absolute",
        border: 0, padding: 0, margin: 0, width: "auto", height: "auto",
        visibility: "hidden"
      });

      img.onload = onload;
      img.onerror = onerror;

      noder.append(el,img);

      if (options.url) {
        _load(options.url);
      }
    }

    function _load(url) {
        img.style.visibility = "hidden";
        img.src = url;
    }

    function _dispose() {
        noder.remove(img);
        styler.css(el,style);
        img = img.onload = img.onerror = null;
    }

    _init();

    var ret =  {
      load : _load,
      dispose : _dispose
    };

    ["vertical","horizontal","rotate","left","right","scale","zoom","zoomin","zoomout","reset"].forEach(
      function(name){
        ret[name] = function() {
          var args = langx.makeArray(arguments);
          args.unshift(img);
          transforms[name].apply(null,args);
        }
      }
    );

    return ret;
  }


  function images() {
    return images;
  }

  images.transform = function (el,options) {
  };

  ["vertical","horizontal","rotate","left","right","scale","zoom","zoomin","zoomout","reset"].forEach(
    function(name){
      images.transform[name] = transforms[name];
    }
  );


  langx.mixin(images, {
    loaded : loaded,

    viewer : viewer
  });

  return skylark.images = images;
});

define([
    "./skylark",
    "./langx",
    "./eventer",
    "./noder",
    "./finder",
    "./geom",
    "./styler",
    "./datax",
    "./transforms",
    "./query"
], function(skylark,langx,eventer,noder,finder,geom,styler,datax,transforms,$) {

  function watch(imgs) {
    if (!langx.isArray(imgs)) {
      imgs = [imgs];
    }
    var totalCount = imgs.length,
        progressedCount = 0,
        successedCount = 0,
        faileredCount = 0,
        d = new langx.Deferred();


    function complete() {

      d.resolve({
        "total" : totalCount,
        "successed" : successedCount,
        "failered" : faileredCount,
        "imgs" : imgs 
      });
    }

    function progress(img,isLoaded) {

      progressedCount++;
      if (isLoaded) {
        successedCount ++ ; 
      } else {
        faileredCount ++ ;
      }

      // progress event
      d.progress({
        "img" : img,
        "isLoaded" : isLoaded,
        "progressed" : progressedCount,
        "total" : totalCount,
        "imgs" : imgs 
      });

      // check if completed
      if ( progressedCount == totalCount ) {
        complete();
      }
    }

    function check() {
      if (!imgs.length ) {
        complete();
        return;
      }

      imgs.forEach(function(img) {
        if (isCompleted(img)) {
          progress(img,isLoaded(img));
        } else {
          eventer.on(img,{
            "load" : function() {
              progress(img,true);
            },

            "error" : function() {
              progress(img,false);
            }
          });      
        }
      });
    }

    langx.defer(check);

    d.promise.totalCount = totalCount;
    return d.promise;
  }


  function isCompleted(img) {
     return img.complete && img.naturalWidth !== undefined;
  }

  function isLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  }

  function loaded(elm,options) {
    var imgs = [];

    options = options || {};

    function addBackgroundImage (elm1) {

      var reURL = /url\((['"])?(.*?)\1\)/gi;
      var matches = reURL.exec( styler.css(elm1,"background-image"));
      var url = matches && matches[2];
      if ( url ) {
        var img = new Image();
        img.src = url;
        imgs.push(img);
      }
    }

    // filter siblings
    if ( elm.nodeName == 'IMG' ) {
      imgs.push( elm );
    } else {
      // find children
      var childImgs = finder.findAll(elm,'img');
      // concat childElems to filterFound array
      for ( var i=0; i < childImgs.length; i++ ) {
        imgs.push(childImgs[i]);
      }

      // get background image on element
      if ( options.background === true ) {
        addBackgroundImage(elm);
      } else  if ( typeof options.background == 'string' ) {
        var children = finder.findAll(elm, options.background );
        for ( i=0; i < children.length; i++ ) {
          addBackgroundImage( children[i] );
        }
      }
    }

    return watch(imgs);
  }

  function preload(urls,options) {
      if (langx.isString(urls)) {
        urls = [urls];
      }
      var images = [];

      urls.forEach(function(url){
        var img = new Image();
        img.src = url;
        images.push(img);
      });

      return watch(images);
  }


  $.fn.imagesLoaded = function( options ) {
    return loaded(this,options);
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

  $.fn.imagesViewer = function( options ) {
    return viewer(this,options);
  };

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
    isCompleted : isCompleted,

    isLoaded : isLoaded,

    loaded : loaded,

    preload : preload,

    viewer : viewer
  });

  return skylark.images = images;
});

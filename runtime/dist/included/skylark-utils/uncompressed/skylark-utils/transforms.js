define([
    "./skylark",
    "./langx",
    "./browser",
    "./datax",
    "./styler"
], function(skylark,langx,browser,datax,styler) {
  var css3Transform = browser.normalizeCssProperty("transform");

  function getMatrix(radian, x, y) {
    var Cos = Math.cos(radian), Sin = Math.sin(radian);
    return {
      M11: Cos * x, 
      M12: -Sin * y,
      M21: Sin * x, 
      M22: Cos * y
    };
  }

  function getZoom(scale, zoom) {
      return scale > 0 && scale > -zoom ? zoom :
        scale < 0 && scale < zoom ? -zoom : 0;
  }

    function change(el,d) {
      var matrix = getMatrix(d.radian, d.y, d.x);
      styler.css(el,css3Transform, "matrix("
        + matrix.M11.toFixed(16) + "," + matrix.M21.toFixed(16) + ","
        + matrix.M12.toFixed(16) + "," + matrix.M22.toFixed(16) + ", 0, 0)"
      );      
  }

  function transformData(el,d) {
    if (d) {
      datax.data(el,"transform",d);
    } else {
      d = datax.data(el,"transform") || {};
      d.radian = d.radian || 0;
      d.x = d.x || 1;
      d.y = d.y || 1;
      d.zoom = d.zoom || 1;
      return d;     
    }
  }

  var calcs = {
    //Vertical flip
    vertical : function (d) {
        d.radian = Math.PI - d.radian; 
        d.y *= -1;
    },

   //Horizontal flip
    horizontal : function (d) {
        d.radian = Math.PI - d.radian; 
        d.x *= -1;
    },

    //Rotate according to angle
    rotate : function (d,degress) {
        d.radian = degress * Math.PI / 180;; 
    },

    //Turn left 90 degrees
    left : function (d) {
        d.radian -= Math.PI / 2; 
    },

    //Turn right 90 degrees
    right : function (d) {
        d.radian += Math.PI / 2; 
    },
 
    //zoom
    scale: function (d,zoom) {
        var hZoom = getZoom(d.y, zoom), vZoom = getZoom(d.x, zoom);
        if (hZoom && vZoom) {
          d.y += hZoom; 
          d.x += vZoom;
        }
    }, 

    //zoom in
    zoomin: function (d) { 
      calcs.scale(d,0.1); 
    },
    
    //zoom out
    zoomout: function (d) { 
      calcs.scale(d,-0.1); 
    }

  };
  
  
  function _createApiMethod(calcFunc) {
    return function() {
      var args = langx.makeArray(arguments),
        el = args.shift(),
          d = transformData(el);
        args.unshift(d);
        calcFunc.apply(this,args)
        change(el,d);
        transformData(el,d);
    }
  }
  
  function transforms() {
    return transforms;
  }

  ["vertical","horizontal","rotate","left","right","scale","zoom","zoomin","zoomout"].forEach(function(name){
    transforms[name] = _createApiMethod(calcs[name]);
  });

  langx.mixin(transforms, {
    reset : function(el) {
      var d = {
        x : 1,
        y : 1,
        radian : 0,
      }
      change(el,d);
      transformData(el,d);
    }
  });


  return skylark.transforms = transforms;
});

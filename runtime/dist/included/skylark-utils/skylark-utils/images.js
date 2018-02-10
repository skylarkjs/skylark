/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx"],function(e,t){function i(){return i}var n={1:!0,9:!0,11:!0},s=t.Evented.inherit({init:function(e,i,n){return this instanceof s?("string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=t.makeArray(e),this.options=t.mixin({},this.options),"function"==typeof i?n=i:t.mixin(this.options,i),n&&this.on("always",n),this.getImages(),void setTimeout(function(){this.check()}.bind(this))):new s(e,i,n)},options:{},getImages:function(){this.images=[],this.elements.forEach(this.addElementImages,this)},addElementImages:function(e){"IMG"==e.nodeName&&this.addImage(e),this.options.background===!0&&this.addElementBackgroundImages(e);var t=e.nodeType;if(t&&n[t]){for(var i=e.querySelectorAll("img"),s=0;s<i.length;s++){var r=i[s];this.addImage(r)}if("string"==typeof this.options.background){var o=e.querySelectorAll(this.options.background);for(s=0;s<o.length;s++){var a=o[s];this.addElementBackgroundImages(a)}}}},addElementBackgroundImages:function(e){var t=getComputedStyle(e);if(t)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(t.backgroundImage);null!==n;){var s=n&&n[2];s&&this.addBackground(s,e),n=i.exec(t.backgroundImage)}},addImage:function(e){var t=new r(e);this.images.push(t)},addBackground:function(e,t){var i=new o(e,t);this.images.push(i)},check:function(){function e(e){setTimeout(function(){t.progress(e)})}var t=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(t){t.one("progress",e),t.check()}):void this.complete()},progress:function(e){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,this.trigger(t.createEvent("progress",{img:e.img,element:e.element,message:e.message,isLoaded:e.isLoaded})),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&console&&console.log("progress: "+message,e.target,e.element)},complete:function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0,this.trigger(e),this.trigger("always")}}),r=t.Evented.inherit({init:function(e){this.img=e},check:function(){var e=this.getIsImageComplete();return e?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},getIsImageComplete:function(){return this.img.complete&&void 0!==this.img.naturalWidth},confirm:function(e,i){this.isLoaded=e,this.trigger(t.createEvent("progress",{img:this.img,element:this.img,message:i,isLoaded:e}))},handleEvent:function(e){var t="on"+e.type;this[t]&&this[t](e)},onload:function(){this.confirm(!0,"onload"),this.unbindEvents()},onerror:function(){this.confirm(!1,"onerror"),this.unbindEvents()},unbindEvents:function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)}}),o=r.inherit({init:function(e,t){this.url=e,this.element=t,this.img=new Image},check:function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var e=this.getIsImageComplete();e&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},unbindEvents:function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},confirm:function(e,i){this.isLoaded=e,this.trigger(t.createEvent("progress",{img:this.img,element:this.element,message:i,isLoaded:e}))}});return t.mixin(i,{loaded:s}),e.images=i});
//# sourceMappingURL=sourcemaps/images.js.map

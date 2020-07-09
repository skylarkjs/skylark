/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../langx"],function(e){function t(){return t}navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;var n=e.Deferred,a=null;return e.mixin(t,{isSupported:function(){return!!navigator.getUserMedia},start:function(e,t){var r=new n;return navigator.getUserMedia({video:!0,audio:!0},function(t){a=t,e.src=window.URL.createObjectURL(localMediaStream),e.onloadedmetadata=function(e){},r.resolve()},function(e){r.reject(e)}),r.promise},stop:function(){a&&(a.stop(),a=null)}}),t});
//# sourceMappingURL=../sourcemaps/_devices/usermedia.js.map

/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../langx"],function(t){function a(){return a}return navigator.vibrate=navigator.vibrate||navigator.webkitVibrate||navigator.mozVibrate||navigator.msVibrate,t.mixin(a,{isSupported:function(){return!!navigator.vibrate},start:function(t){navigator.vibrate(t)},stop:function(){navigator.vibrate(0)}}),a});
//# sourceMappingURL=../sourcemaps/_devices/vibrate.js.map

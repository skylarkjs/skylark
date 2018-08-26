/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../langx"],function(n){function i(){return i}return window.DeviceOrientationEvent?window.addEventListener("deviceorientation",function(n){({lr:n.gamma,fb:n.beta,dir:n.alpha,grav:null})},!1):window.OrientationEvent&&window.addEventListener("MozOrientation",function(n){({lr:90*n.x,fb:n.y*-90,dir:null,grav:n.z})},!1),n.mixin(i,{isSupported:function(){return!(!window.DeviceOrientationEvent&&!window.OrientationEvent)},on:function(n){navigator.vibrate(n)},off:function(){navigator.vibrate(0)}}),i});
//# sourceMappingURL=../sourcemaps/_devices/orientation.js.map

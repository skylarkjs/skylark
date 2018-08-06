/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./browser","./datax","./styler"],function(n,a,t,r,o){function i(n,a,t){var r=Math.cos(n),o=Math.sin(n);return{M11:r*a,M12:-o*t,M21:o*a,M22:r*t}}function e(n,a){return n>0&&n>-a?a:n<0&&n<a?-a:0}function f(n,a){var t=i(a.radian,a.y,a.x);o.css(n,d,"matrix("+t.M11.toFixed(16)+","+t.M21.toFixed(16)+","+t.M12.toFixed(16)+","+t.M22.toFixed(16)+", 0, 0)")}function c(n,a){return a?void r.data(n,"transform",a):(a=r.data(n,"transform")||{},a.radian=a.radian||0,a.x=a.x||1,a.y=a.y||1,a.zoom=a.zoom||1,a)}function u(n){return function(){var t=a.makeArray(arguments),r=t.shift(),o=c(r);t.unshift(o),n.apply(this,t),f(r,o),c(r,o)}}function s(){return s}var d=t.normalizeCssProperty("transform"),h={vertical:function(n){n.radian=Math.PI-n.radian,n.y*=-1},horizontal:function(n){n.radian=Math.PI-n.radian,n.x*=-1},rotate:function(n,a){n.radian=a*Math.PI/180},left:function(n){n.radian-=Math.PI/2},right:function(n){n.radian+=Math.PI/2},scale:function(n,a){var t=e(n.y,a),r=e(n.x,a);t&&r&&(n.y+=t,n.x+=r)},zoomin:function(n){h.scale(n,.1)},zoomout:function(n){h.scale(n,-.1)}};return["vertical","horizontal","rotate","left","right","scale","zoom","zoomin","zoomout"].forEach(function(n){s[n]=u(h[n])}),a.mixin(s,{reset:function(n){var a={x:1,y:1,radian:0};f(n,a),c(n,a)}}),n.transforms=s});
//# sourceMappingURL=sourcemaps/transforms.js.map

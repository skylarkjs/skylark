/**
 * skylark-langx - A simple JavaScript language extension library, including class support, Evented class, Deferred class and some commonly used tool functions.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./objects","./types"],function(n,t){function e(n){return requestAnimationFrame?requestAnimationFrame(n):setTimeoutout(n),this}function r(){}function u(n,t){var e=2 in arguments&&slice.call(arguments,2);if(c(n)){var r=function(){return n.apply(t,e?e.concat(slice.call(arguments)):arguments)};return r}if(a(t))return e?(e.unshift(n[t],n),u.apply(null,e)):u(n[t],n);throw new TypeError("expected function")}function i(n,t){var e;return function(){var r=this,u=arguments,i=function(){e=null,n.apply(r,u)};e&&clearTimeout(e),e=setTimeout(i,t)}}var o=n.mixin,c=t.isFunction,a=t.isString,f=function(){function n(){}return function(t,e){n.prototype=t;var r=new n;return n.prototype=null,e&&o(r,e),r}}();return{debounce:i,delegate:f,defer:e,noop:r,proxy:u,returnTrue:function(){return!0},returnFalse:function(){return!1}}});
//# sourceMappingURL=sourcemaps/funcs.js.map

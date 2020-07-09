/**
 * skylark-langx - A simple JavaScript language extension library, including class support, Evented class, Deferred class and some commonly used tool functions.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./arrays","./ArrayStore","./aspect","./async","./Deferred","./Evented","./funcs","./klass","./objects","./Restful","./Stateful","./strings","./types","./Xhr"],function(t,r,n,e,i,o,u,a,s,f,c,l,y,d,p){"use strict";function w(t,r){var n=new CustomEvent(t,r);return R(n,r)}function v(t,r,n,e){return S(r)?r.call(t,n,e):r}function A(t){var t=t||window.location.href,r=t.split("?"),n={};return r.length>1&&r[1].split("&").forEach(function(t){var r=t.split("=");n[r[0]]=r[1]}),n}function g(t){return parseFloat(t)||0}function h(t){return t._uid||(t._uid=m++)}function k(t){var r=++L+"";return t?t+r:r}function x(){return x}var E=({}.toString,Array.prototype.concat,Array.prototype.indexOf,Array.prototype.slice,Array.prototype.filter,f.mixin),R=f.safeMixin,S=d.isFunction,m=1,L=0;return E(x,{createEvent:w,funcArg:v,getQueryParams:A,toPixel:g,uid:h,uniqueId:k,URL:"undefined"!=typeof window?window.URL||window.webkitURL:null}),E(x,r,e,a,f,y,d,{ArrayStore:n,async:i,Deferred:o,Evented:u,klass:s,Restful:c,Stateful:l,Xhr:p}),t.langx=x});
//# sourceMappingURL=sourcemaps/langx.js.map

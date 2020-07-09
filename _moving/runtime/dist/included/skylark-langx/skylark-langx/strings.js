/**
 * skylark-langx - A simple JavaScript language extension library, including class support, Evented class, Deferred class and some commonly used tool functions.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){function r(r){return r.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function e(r){try{return r?"true"==r||"false"!=r&&("null"==r?null:+r+""==r?+r:/^[\[\{]/.test(r)?JSON.parse(r):r):r}catch(e){return r}}function t(r){return null==r?"":String.prototype.trim.call(r)}function n(r,e,t,n){function u(r,e){if(r.match(/\./)){var t,n=function(r,e){var u=r.pop();return u?e[u]?n(r,t=e[u]):null:t};return n(r.split(".").reverse(),e)}return e[r]}return n=n||window,t=t?proxy(n,t):function(r){return r},r.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,function(r,i,a){var c=u(i,e);return a&&(c=u(a,n).call(n,c,i)),t(c,i).toString()})}return{camelCase:function(r){return r.replace(/-([\da-z])/g,function(r){return r.toUpperCase().replace("-","")})},dasherize:r,deserializeValue:e,lowerFirst:function(r){return r.charAt(0).toLowerCase()+r.slice(1)},serializeValue:function(r){return JSON.stringify(r)},substitute:n,trim:t,upperFirst:function(r){return r.charAt(0).toUpperCase()+r.slice(1)}}});
//# sourceMappingURL=sourcemaps/strings.js.map

/**
 * skylark-langx - A simple JavaScript language extension library, including class support, Evented class, Deferred class and some commonly used tool functions.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./types"],function(r){function n(r){return a.call(r,function(r){return null!=r})}function t(r,n){var t,e,i,f,u;if(r)if(t=r.length,t===f){for(e in r)if(r.hasOwnProperty(e)&&(u=r[e],n.call(u,e,u)===!1))break}else for(i=0;i<t&&(u=r[i],n.call(u,i,u)!==!1);i++);return this}function e(r){if(c(r)){for(var n=[],t=0;t<r.length;t++){var e=r[t];if(c(e))for(var i=0;i<e.length;i++)n.push(e[i]);else n.push(e)}return n}return r}function i(r,n){if(!n)return-1;var t;if(n.indexOf)return n.indexOf(r);for(t=n.length;t--;)if(n[t]===r)return t;return-1}function f(r,n,t){return c(r)?(t||[]).concat(Array.prototype.slice.call(r,n||0)):[r]}function u(r,n){var t,i,f,u=[];if(c(r))for(i=0;i<r.length;i++)t=n.call(r[i],r[i],i),null!=t&&u.push(t);else for(f in r)t=n.call(r[f],r[f],f),null!=t&&u.push(t);return e(u)}function l(r){return a.call(r,function(n,t){return r.indexOf(n)==t})}var a=Array.prototype.filter,c=r.isArrayLike;return{compact:n,first:function(r,n){return n?r.slice(0,n):r[0]},each:t,flatten:e,inArray:i,makeArray:f,map:u,uniq:l}});
//# sourceMappingURL=sourcemaps/arrays.js.map

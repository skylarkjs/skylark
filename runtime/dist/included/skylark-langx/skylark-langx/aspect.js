/**
 * skylark-langx - A simple JavaScript language extension library, including class support, Evented class, Deferred class and some commonly used tool functions.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){function e(e,r,n,i){var a,u=e[r],o="around"==r;if(o){var v=n(function(){return u.advice(this,arguments)});a={remove:function(){v&&(v=e=n=null)},advice:function(e,r){return v?v.apply(e,r):u.advice(e,r)}}}else a={remove:function(){if(a.advice){var t=a.previous,i=a.next;i||t?(t?t.next=i:e[r]=i,i&&(i.previous=t)):delete e[r],e=n=a.advice=null}},id:t++,advice:n,receiveArguments:i};if(u&&!o)if("after"==r){for(;u.next&&(u=u.next););u.next=a,a.previous=u}else"before"==r&&(e[r]=a,a.next=u,u.previous=a);else e[r]=a;return a}function r(r){return function(i,a,u,o){var v,f=i[a];f&&f.target==i||(i[a]=v=function(){for(var e=t,r=arguments,i=v.before;i;)r=i.advice.apply(this,r)||r,i=i.next;if(v.around)var a=v.around.advice(this,r);for(var u=v.after;u&&u.id<e;){if(u.receiveArguments){var o=u.advice.apply(this,r);a=o===n?a:o}else a=u.advice.call(this,a,r);u=u.next}return a},f&&(v.around={advice:function(e,r){return f.apply(e,r)}}),v.target=i);var c=e(v||f,r,u,o);return u=null,c}}var n,t=0;return{after:r("after"),around:r("around"),before:r("before")}});
//# sourceMappingURL=sourcemaps/aspect.js.map

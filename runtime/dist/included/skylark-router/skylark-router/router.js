/**
 * skylark-router - An Elegant HTML5 Routing Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.6-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx"],function(t,e){function n(t,n){var r=new CustomEvent(t,n);return e.safeMixin(r,n)}function r(){return d}function i(t){if(d){var r=d.route.exit({path:d.path,params:d.params},!0);if(!r)return}if(v=d,d=t,!d.route){var i=u(d.path);d.route=i.route,d.params=i.params}var a=d.route.enter({force:d.force,path:d.path,params:d.params},!0);e.Deferred.when(a).then(function(){H.trigger(n("routing",{current:d,previous:v})),d.route.enter({path:d.path,params:d.params},!1),v&&v.route.exit({path:v.path,params:v.params},!1),H.trigger(n("routed",{current:d,previous:v}))})}function a(t,e){if(!e&&d&&d.path==t)return!1;var r=u(t);if(r)if(r.path=t,b.useHistoryApi){var a={force:e,path:t};window.history.pushState(a,document.title,(m+t).replace("//","/")),window.dispatchEvent(n("popstate",{state:a}))}else if(b.useHashbang){var o="#!"+t;window.location.hash!==o?window.location.hash=o:i(r)}else i(r);return!0}function u(t,n){var r=!1;return!n&&(r=y[t])?r:(e.each(x,function(e,n){var i=n.match(t);return!i||(r={route:n,params:i},!1)}),r&&!n&&(y[t]=r),r)}function o(t,e){var n,r=x[t];return r&&(n=r.path(e)),n}function s(){return v}function h(t){return e.isDefined(t)?(m=t,this):m}function f(){return H}function p(t){return e.isDefined(t)?(w=t,this):w}function c(t,n){if(e.isDefined(n)){var r={};return r[t]=n,l(r),this}return x[t]}function l(t){if(!e.isDefined(t))return e.mixin({},x);for(var n in t)x[n]=new b.Route(n,t[n])}function g(){null==b.useHashbang&&null==b.useHistoryApi&&(window.location.host&&window.history.pushState?b.useHistoryApi=!0:b.useHashbang=!0);var t="";b.useHistoryApi?(t=window.location.pathname,void 0===m&&(m=t.replace(/\/$/,"")),t=t.replace(m,"")||w||"/"):t=b.useHashbang?window.location.hash.replace("#!","")||w||"/":"/",t.startsWith("/")||(t="/"+t),b.useHistoryApi?window.addEventListener("popstate",function(t){t.state&&i(t.state),t.preventDefault()}):b.useHashbang&&window.addEventListener("hashchange",function(t){i({path:window.location.hash.replace(/^#!/,"")}),t.preventDefault()}),a(t)}var d,v,m,w,x={},y={},H=new e.Evented,_=e.Evented.inherit({klassName:"Route",init:function(t,n){n=e.mixin({},n);var r=n.pathto||"",i=r,a=i.match(/\:([a-zA-Z0-9_]+)/g);null!==a?(a=a.map(function(t){return t.substring(1)}),i=i.replace(/\:([a-zA-Z0-9_]+)/g,"(.*?)")):a=[],i="*"===i?"(.*)":i.replace("/","\\/"),this._setting=n,this.name=t,this.pathto=r,this.paramNames=a,this.params=i,this.regex=new RegExp("^"+i+"$","");var u=this;["entering","entered","exiting","exited"].forEach(function(t){e.isFunction(n[t])&&u.on(t,n[t])})},enter:function(t,r){if(r){var i=this._entering(t),a=this;return e.Deferred.when(i).then(function(){var t=n("entering",{route:a,result:!0});return a.trigger(t),t.result})}return this._entered(t),this.trigger(n("entered",e.safeMixin({route:this},t))),this},exit:function(t,r){if(r){var i=this._exiting(t);if(!i)return!1;var a=n("exiting",{route:this,result:!0});return this.trigger(a),a.result}return this._exited(t),this.trigger(n("exited",e.safeMixin({route:this},t))),this},match:function(t){var e=this.paramNames,n=t.indexOf("?"),t=~n?t.slice(0,n):decodeURIComponent(t),r=this.regex.exec(t);if(!r)return!1;for(var i={},a=1,u=r.length;a<u;++a){var o=e[a-1],s=decodeURIComponent(r[a]);i[o]=s}return i},path:function(t){var e=this.pathto;return t&&(e=e.replace(/:([a-zA-Z0-9_]+)/g,function(e,n){return t[n]})),e},_entering:function(t){return!0},_entered:function(t){return!0},_exiting:function(t){return!0},_exited:function(t){return!0}}),b=function(){return b};return e.mixin(b,{Route:_,current:r,go:a,map:u,hub:f,off:function(){H.off.apply(H,arguments)},on:function(){H.on.apply(H,arguments)},one:function(){H.one.apply(H,arguments)},path:o,previous:s,baseUrl:h,homePath:p,route:c,routes:l,start:g,trigger:function(t){return H.trigger(t),this},useHistoryApi:null,useHashbang:null}),t.router=b});
//# sourceMappingURL=sourcemaps/router.js.map

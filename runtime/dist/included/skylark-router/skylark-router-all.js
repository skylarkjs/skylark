/**
 * skylark-router - An Elegant HTML5 Routing Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(t,n){function r(t,n){if("."!==t[0])return t;var r=n.split("/"),e=t.split("/");r.pop();for(var i=0;i<e.length;i++)"."!=e[i]&&(".."==e[i]?r.pop():r.push(e[i]));return r.join("/")}var e=n.define,i=n.require,o="function"==typeof e&&e.amd,u=!o&&"undefined"!=typeof exports;if(!o&&!e){var a={};e=n.define=function(t,n,e){"function"==typeof e?(a[t]={factory:e,deps:n.map(function(n){return r(n,t)}),exports:null},i(t)):resolved[t]=e},i=n.require=function(t){if(!a.hasOwnProperty(t))throw new Error("Module "+t+" has not been defined");var n=a[t];if(!n.exports){var r=[];n.deps.forEach(function(t){r.push(i(t))}),n.exports=n.factory.apply(window,r)}return n.exports}}if(!e)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");t(e,i),o||(u?exports=i("skylark-router/router"):n.skylarkjs=i("skylark-router/main"))}(function(t,n){t("skylark-langx/skylark",[],function(){var t={};return t}),t("skylark-langx/langx",["./skylark"],function(t){function n(t){var r;if(void 0===t||null===t)r=t;else if(t.clone)r=t.clone();else if(l(t)){r=[];for(var e=0;e<t.length;e++)r.push(n(t[e]))}else if(y(t)){r={};for(var i in t)r[i]=n(t[i])}else r=t;return r}function r(t,n){var r,e,i=function(){t.apply(null,e)};return function(){e=arguments,clearTimeout(r),r=setTimeout(i,n)}}function e(t){return Z.call(t,function(t){return null!=t})}function i(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function o(t){try{return t?"true"==t||"false"!=t&&("null"==t?null:+t+""==t?+t:/^[\[\{]/.test(t)?JSON.parse(t):t):t}catch(n){return t}}function u(t,n){var r,e,i,o,u;if(t)if(r=t.length,r===o){for(e in t)if(t.hasOwnProperty(e)&&(u=t[e],n.call(u,e,u)===!1))break}else for(i=0;i<r&&(u=t[i],n.call(u,i,u)!==!1);i++);return this}function a(t){if(p(t)){for(var n=[],r=0;r<t.length;r++){var e=t[r];if(p(e))for(var i=0;i<e.length;i++)n.push(e[i]);else n.push(e)}return n}return t}function s(t,n,r,e){return d(n)?n.call(t,r,e):n}function c(t){var t=t||window.location.href,n=t.split("?"),r={};return n.length>1&&n[1].split("&").forEach(function(t){var n=t.split("=");r[n[0]]=n[1]}),r}function f(t,n){if(!n)return-1;var r;if(n.indexOf)return n.indexOf(t)>-1;for(r=n.length;r--;)if(n[r]===t)return!0;return!1}function l(t){return t instanceof Array}function p(t){return!(m(t)||t.nodeName&&"#text"==t.nodeName||"number"!=typeof t.length)}function h(t){return"boolean"==typeof t}function v(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function d(t){return"function"==J(t)}function g(t){return"object"==J(t)}function y(t){return g(t)&&!w(t)&&Object.getPrototypeOf(t)==Object.prototype}function m(t){return"string"==typeof t}function w(t){return t&&t==t.window}function x(t){return"undefined"!=typeof t}function b(t){return t&&t instanceof Node}function k(t){return"number"==typeof t}function _(t){if(t){var n=location.protocol+"//"+location.hostname;return location.port&&(n+=":"+location.port),t.startsWith(n)}}function E(t){var n;for(n in t)if(null!==t[n])return!1;return!0}function j(t,n,r){return(r||[]).concat(Array.prototype.slice.call(t,n||0))}function O(t,n){var r,e,i,o=[];if(p(t))for(e=0;e<t.length;e++)r=n.call(t[e],t[e],e),null!=r&&o.push(r);else for(i in t)r=n.call(t[i],t[i],i),null!=r&&o.push(r);return a(o)}function A(t){return requestAnimationFrame(t),this}function T(t,n){var r=2 in arguments&&M.call(arguments,2);if(d(t)){var e=function(){return t.apply(n,r?r.concat(M.call(arguments)):arguments)};return e}if(m(n))return r?(r.unshift(t[n],t),T.apply(null,r)):T(t[n],t);throw new TypeError("expected function")}function D(t){return parseFloat(t)||0}function N(t){return null==t?"":String.prototype.trim.call(t)}function H(t,n){if(l(t)){var r=t.indexOf(n);r!=-1&&t.splice(r,1)}else if(y(t))for(var e in t)if(t[e]==n){delete t[e];break}return this}function P(t,n,r,e){for(var i in n)n.hasOwnProperty(i)&&(e&&void 0!==t[i]||(r&&(y(n[i])||l(n[i]))?(y(n[i])&&!y(t[i])&&(t[i]={}),l(n[i])&&!l(t[i])&&(t[i]=[]),P(t[i],n[i],r,e)):void 0!==n[i]&&(t[i]=n[i])));return t}function C(t){var n=M.call(arguments,0);return target=n.shift(),deep=!1,h(n[n.length-1])&&(deep=n.pop()),{target:target,sources:n,deep:deep}}function S(){var t=C.apply(this,arguments);return t.sources.forEach(function(n){P(t.target,n,t.deep,!1)}),t.target}function R(){var t=C.apply(this,arguments);return t.sources.forEach(function(n){P(t.target,n,t.deep,!0)}),t.target}function z(t,n,r,e){function i(t,n){if(t.match(/\./)){var r,e=function(t,n){var i=t.pop();return i?n[i]?e(t,r=n[i]):null:r};return e(t.split(".").reverse(),n)}return n[t]}return e=e||window,r=r?T(e,r):function(t){return t},t.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,function(t,o,u){var a=i(o,n);return u&&(a=i(u,e).call(e,a,o)),r(a,o).toString()})}function F(t){return t._uid||t.id||(t._uid=V++)}function L(t){return Z.call(t,function(n,r){return t.indexOf(n)==r})}function U(){return U}var $={}.toString,M=(Array.prototype.concat,Array.prototype.indexOf,Array.prototype.slice),Z=Array.prototype.filter,q=function(){function t(t,n,r){var e=t.prototype,i=t.superclass.prototype,o=r&&r.noOverrided;for(var u in n)"constructor"!==u&&(e[u]="function"!=typeof n[u]||o||"function"!=typeof i[u]?n[u]:function(t,n,r){return function(){var t=this.overrided;this.overrided=r;var e=n.apply(this,arguments);return this.overrided=t,e}}(u,n[u],i[u]));return t}return function n(r,e,i){var o=r.constructor;o===Object&&(o=function(){this.init&&this.init.apply(this,arguments)});var u=r.klassName||"",a=new Function("return function "+u+"() {var inst = this, ctor = arguments.callee;if (!(inst instanceof ctor)) {inst = Object.create(ctor.prototype);}ctor._constructor.apply(inst, arguments);return inst;}")();return a._constructor=o,e=e||Object,a.prototype=Object.create(e.prototype),a.prototype.constructor=a,a.superclass=e,a.__proto__=e,a.partial||(a.partial=function(n,r){return t(this,n,r)}),a.inherit||(a.inherit=function(t,r){return n(t,this,r)}),a.partial(r,i),a}}(),I=function(){function t(){}return function(n,r){t.prototype=n;var e=new t;return t.prototype=null,r&&S(e,r),e}}(),W=function(){this.promise=new Promise(function(t,n){this._resolve=t,this._reject=n}.bind(this)),this.resolve=W.prototype.resolve.bind(this),this.reject=W.prototype.reject.bind(this)};W.prototype.resolve=function(t){return this._resolve.call(this.promise,t),this},W.prototype.reject=function(t){return this._reject.call(this.promise,t),this},W.prototype.then=function(t,n,r){return this.promise.then(t,n,r)},W.all=function(t){return Promise.all(t)},W.first=function(t){return Promise.race(t)},W.when=function(t,n,r,e){var i=t&&"function"==typeof t.then,o=i&&t instanceof Promise;if(!i)return arguments.length>1?n?n(t):t:(new W).resolve(t);if(!o){var u=new W(t.cancel);t.then(u.resolve,u.reject,u.progress),t=u.promise}return n||r||e?t.then(n,r,e):t},W.reject=function(t){var n=new W;return n.reject(t),n.promise},W.resolve=function(t){var n=new W;return n.resolve(t),n.promise},W.immediate=W.resolve;var B=q({on:function(t,n,r,e,i,o){var a=this,s=this._hub||(this._hub={});return y(t)?(i=e,u(t,function(t,e){a.on(t,n,r,e,i,o)}),this):(m(n)||d(e)||(i=e,e=r,r=n,n=void 0),d(r)&&(i=e,e=r,r=null),m(t)&&(t=t.split(/\s/)),t.forEach(function(t){(s[t]||(s[t]=[])).push({fn:e,selector:n,data:r,ctx:i,one:o})}),this)},one:function(t,n,r,e,i){return this.on(t,n,r,e,i,1)},trigger:function(t){if(!this._hub)return this;var n=this;m(t)&&(t=new CustomEvent(t));var r=M.call(arguments,1);return r=x(r)?[t].concat(r):[t],[t.type||t.name,"all"].forEach(function(i){var o=n._hub[i];if(o){for(var u=o.length,a=!1,s=0;s<u;s++){var c=o[s];t.data?c.data&&(t.data=S({},c.data,t.data)):t.data=c.data||null,c.fn.apply(c.ctx,r),c.one&&(o[s]=null,a=!0)}a&&(n._hub[i]=e(o))}}),this},listened:function(t){var n=(this._hub||(this._events={}))[t]||[];return n.length>0},listenTo:function(t,n,r,e){if(!t)return this;m(r)&&(r=this[r]),e?t.one(n,r,this):t.on(n,r,this);for(var i,o=this._listeningTo||(this._listeningTo=[]),u=0;u<o.length;u++)if(o[u].obj==t){i=o[u];break}i||o.push(i={obj:t,events:{}});var a=i.events,s=a[n]=a[n]||[];return s.indexOf(r)==-1&&s.push(r),this},listenToOnce:function(t,n,r){return this.listenTo(t,n,r,1)},off:function(t,n){var r=this._hub||(this._hub={});return m(t)&&(t=t.split(/\s/)),t.forEach(function(t){var e=r[t],i=[];if(e&&n)for(var o=0,u=e.length;o<u;o++)e[o].fn!==n&&e[o].fn._!==n&&i.push(e[o]);i.length?r[t]=i:delete r[t]}),this},unlistenTo:function(t,n,r){var i=this._listeningTo;if(!i)return this;for(var o=0;o<i.length;o++){var u=i[o];if(!t||t==u.obj){var a=u.events;for(var s in a)if(!n||n==s){listeningEvent=a[s];for(var c=0;c<listeningEvent.length;c++)r&&r!=listeningEvent[o]||(u.obj.off(s,listeningEvent[o],this),listeningEvent[o]=null);listeningEvent=a[s]=e(listeningEvent),E(listeningEvent)&&(a[s]=null)}E(a)&&(i[o]=null)}}return i=this._listeningTo=e(i),E(i)&&(this._listeningTo=null),this}}),J=(function(){var t;return function(n){return t||(t=document.createElement("a")),t.href=n,t.href}}(),function(){var t={};return u("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(n,r){t["[object "+r+"]"]=r.toLowerCase()}),function(n){return null==n?String(n):t[$.call(n)]||"object"}}()),V=1;return S(U,{camelCase:function(t){return t.replace(/-([\da-z])/g,function(t){return t.toUpperCase().replace("-","")})},clone:n,compact:e,dasherize:i,debounce:r,delegate:I,Deferred:W,Evented:B,deserializeValue:o,each:u,flatten:a,funcArg:s,getQueryParams:c,inArray:f,isArray:l,isArrayLike:p,isBoolean:h,isDefined:function(t){return void 0!==t},isDocument:v,isEmptyObject:E,isFunction:d,isHtmlNode:b,isObject:g,isPlainObject:y,isNumber:k,isString:m,isSameOrigin:_,isWindow:w,klass:function(t,n,r){return q(t,n,r)},lowerFirst:function(t){return t.charAt(0).toLowerCase()+t.slice(1)},makeArray:j,map:O,mixin:S,nextTick:A,proxy:T,removeItem:H,returnTrue:function(){return!0},returnFalse:function(){return!1},safeMixin:R,serializeValue:function(t){return JSON.stringify(t)},substitute:z,toPixel:D,trim:N,type:J,uid:F,uniq:L,upperFirst:function(t){return t.charAt(0).toUpperCase()+t.slice(1)},URL:window.URL||window.webkitURL}),t.langx=U}),t("skylark-router/router",["skylark-langx/skylark","skylark-langx/langx"],function(t,n){function r(t,r){var e=new CustomEvent(t,r);return n.safeMixin(e,r)}function e(){return d}function i(t){if(d){var e=d.route.exit({path:d.path,params:d.params},!0);if(!e)return}if(g=d,d=t,!d.route){var i=u(d.path);d.route=i.route,d.params=i.params}var o=d.route.enter({force:d.force,path:d.path,params:d.params},!0);n.Deferred.when(o).then(function(){b.trigger(r("routing",{current:d,previous:g})),d.route.enter({path:d.path,params:d.params},!1),g&&g.route.exit({path:g.path,params:g.params},!1),b.trigger(r("routed",{current:d,previous:g}))})}function o(t,n){if(!n&&d&&d.path==t)return!1;var e=u(t);if(e)if(e.path=t,_.useHistoryApi){var o={force:n,path:t};window.history.pushState(o,document.title,(y+t).replace("//","/")),window.dispatchEvent(r("popstate",{state:o}))}else if(_.useHashbang){var a="#!"+t;window.location.hash!==a?window.location.hash=a:i(e)}else i(e);return!0}function u(t,r){var e=!1;return!r&&(e=x[t])?e:(n.each(w,function(n,r){var i=r.match(t);return!i||(e={route:r,params:i},!1)}),e&&!r&&(x[t]=e),e)}function a(t,n){var r,e=w[t];return e&&(r=e.path(n)),r}function s(){return g}function c(t){return n.isDefined(t)?(y=t,this):y}function f(){return b}function l(t){return n.isDefined(t)?(m=t,this):m}function p(t,r){if(n.isDefined(r)){var e={};return e[t]=r,h(e),this}return w[t]}function h(t){if(!n.isDefined(t))return n.mixin({},w);for(var r in t)w[r]=new _.Route(r,t[r])}function v(){null==_.useHashbang&&null==_.useHistoryApi&&(window.location.host&&window.history.pushState?_.useHistoryApi=!0:_.useHashbang=!0);var t="";_.useHistoryApi?(t=window.location.pathname,void 0===y&&(y=t.replace(/\/$/,"")),t=t.replace(y,"")||m||"/"):t=_.useHashbang?window.location.hash.replace("#!","")||m||"/":"/",t.startsWith("/")||(t="/"+t),_.useHistoryApi?window.addEventListener("popstate",function(t){t.state&&i(t.state),t.preventDefault()}):_.useHashbang&&window.addEventListener("hashchange",function(t){i({path:window.location.hash.replace(/^#!/,"")}),t.preventDefault()}),o(t)}var d,g,y,m,w={},x={},b=new n.Evented,k=n.Evented.inherit({klassName:"Route",init:function(t,r){r=n.mixin({},r);var e=r.pathto||"",i=e,o=i.match(/\:([a-zA-Z0-9_]+)/g);null!==o?(o=o.map(function(t){return t.substring(1)}),i=i.replace(/\:([a-zA-Z0-9_]+)/g,"(.*?)")):o=[],i="*"===i?"(.*)":i.replace("/","\\/"),this._setting=r,this.name=t,this.pathto=e,this.paramNames=o,this.params=i,this.regex=new RegExp("^"+i+"$","");var u=this;["entering","entered","exiting","exited"].forEach(function(t){n.isFunction(r[t])&&u.on(t,r[t])})},enter:function(t,e){if(e){var i=this._entering(t),o=this;return n.Deferred.when(i).then(function(){var t=r("entering",{route:o,result:!0});return o.trigger(t),t.result})}return this._entered(t),this.trigger(r("entered",n.safeMixin({route:this},t))),this},exit:function(t,e){if(e){var i=this._exiting(t);if(!i)return!1;var o=r("exiting",{route:this,result:!0});return this.trigger(o),o.result}return this._exited(t),this.trigger(r("exited",n.safeMixin({route:this},t))),this},match:function(t){var n=this.paramNames,r=t.indexOf("?"),t=~r?t.slice(0,r):decodeURIComponent(t),e=this.regex.exec(t);if(!e)return!1;for(var i={},o=1,u=e.length;o<u;++o){var a=n[o-1],s=decodeURIComponent(e[o]);i[a]=s}return i},path:function(t){var n=this.pathto;return t&&(n=n.replace(/:([a-zA-Z0-9_]+)/g,function(n,r){return t[r]})),n},_entering:function(t){return!0},_entered:function(t){return!0},_exiting:function(t){return!0},_exited:function(t){return!0}}),_=function(){return _};return n.mixin(_,{Route:k,current:e,go:o,map:u,hub:f,off:function(){b.off.apply(b,arguments)},on:function(){b.on.apply(b,arguments)},one:function(){b.one.apply(b,arguments)},path:a,previous:s,baseUrl:c,homePath:l,route:p,routes:h,start:v,trigger:function(t){return b.trigger(t),this},useHistoryApi:null,useHashbang:null}),t.router=_}),t("skylark-router/main",["skylark-langx/skylark","./router"],function(t){return t}),t("skylark-router",["skylark-router/main"],function(t){return t})},this);
//# sourceMappingURL=sourcemaps/skylark-router-all.js.map

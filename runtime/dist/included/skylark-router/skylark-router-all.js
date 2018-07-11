/**
 * skylark-router - An Elegant HTML5 Routing Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.6-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(t,e){function r(t,e){if("."!==t[0])return t;var r=e.split("/"),n=t.split("/");r.pop();for(var i=0;i<n.length;i++)"."!=n[i]&&(".."==n[i]?r.pop():r.push(n[i]));return r.join("/")}var n=e.define,i=e.require,o="function"==typeof n&&n.amd,s=!o&&"undefined"!=typeof exports;if(!o&&!n){var a={};n=e.define=function(t,e,n){"function"==typeof n?(a[t]={factory:n,deps:e.map(function(e){return r(e,t)}),exports:null},i(t)):a[t]=n},i=e.require=function(t){if(!a.hasOwnProperty(t))throw new Error("Module "+t+" has not been defined");var e=a[t];if(!e.exports){var r=[];e.deps.forEach(function(t){r.push(i(t))}),e.exports=e.factory.apply(window,r)}return e.exports}}if(!n)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");t(n,i),o||(s?exports=i("skylark-router/router"):e.skylarkjs=i("skylark-router/main"))}(function(define,require){define("skylark-langx/skylark",[],function(){var t={};return t}),define("skylark-langx/langx",["./skylark"],function(skylark){"use strict";function createAssigner(t,e){return function(r){var n=arguments.length;if(e&&(r=Object(r)),n<2||null==r)return r;for(var i=1;i<n;i++)for(var o=arguments[i],s=t(o),a=s.length,u=0;u<a;u++){var c=s[u];e&&void 0!==r[c]||(r[c]=o[c])}return r}}function advise(t,e,r,n){var i,o=t[e],s="around"==e;if(s){var a=r(function(){return o.advice(this,arguments)});i={remove:function(){a&&(a=t=r=null)},advice:function(t,e){return a?a.apply(t,e):o.advice(t,e)}}}else i={remove:function(){if(i.advice){var n=i.previous,o=i.next;o||n?(n?n.next=o:t[e]=o,o&&(o.previous=n)):delete t[e],t=r=i.advice=null}},id:nextId++,advice:r,receiveArguments:n};if(o&&!s)if("after"==e){for(;o.next&&(o=o.next););o.next=i,i.previous=o}else"before"==e&&(t[e]=i,i.next=o,o.previous=i);else t[e]=i;return i}function aspect(t){return function(e,r,n,i){var o,s=e[r];s&&s.target==e||(e[r]=o=function(){for(var t=nextId,e=arguments,r=o.before;r;)e=r.advice.apply(this,e)||e,r=r.next;if(o.around)var n=o.around.advice(this,e);for(var i=o.after;i&&i.id<t;){if(i.receiveArguments){var s=i.advice.apply(this,e);n=s===undefined?n:s}else n=i.advice.call(this,n,e);i=i.next}return n},s&&(o.around={advice:function(t,e){return s.apply(t,e)}}),o.target=e);var a=advise(o||s,t,n,i);return n=null,a}}function allKeys(t){if(!isObject(t))return[];var e=[];for(var r in t)e.push(r);return e}function createEvent(t,e){var r=new CustomEvent(t,e);return safeMixin(r,e)}function debounce(t,e){var r,n,i=function(){t.apply(null,n)};return function(){n=arguments,clearTimeout(r),r=setTimeout(i,e)}}function values(t){for(var e=_.keys(t),r=e.length,n=Array(r),i=0;i<r;i++)n[i]=t[e[i]];return n}function clone(t,e){var r;if(t===undefined||null===t)r=t;else if(e&&t.clone)r=t.clone();else if(isArray(t)){r=[];for(var n=0;n<t.length;n++)r.push(clone(t[n]))}else if(isPlainObject(t)){r={};for(var i in t)r[i]=clone(t[i])}else r=t;return r}function compact(t){return filter.call(t,function(t){return null!=t})}function dasherize(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function deserializeValue(t){try{return t?"true"==t||"false"!=t&&("null"==t?null:+t+""==t?+t:/^[\[\{]/.test(t)?JSON.parse(t):t):t}catch(e){return t}}function each(t,e){var r,n,i,o,s;if(t)if(r=t.length,r===o){for(n in t)if(t.hasOwnProperty(n)&&(s=t[n],e.call(s,n,s)===!1))break}else for(i=0;i<r&&(s=t[i],e.call(s,i,s)!==!1);i++);return this}function flatten(t){if(isArrayLike(t)){for(var e=[],r=0;r<t.length;r++){var n=t[r];if(isArrayLike(n))for(var i=0;i<n.length;i++)e.push(n[i]);else e.push(n)}return e}return t}function funcArg(t,e,r,n){return isFunction(e)?e.call(t,r,n):e}function getQueryParams(t){var t=t||window.location.href,e=t.split("?"),r={};return e.length>1&&e[1].split("&").forEach(function(t){var e=t.split("=");r[e[0]]=e[1]}),r}function grep(t,e){var r=[];return each(t,function(t,n){e(n,t)&&r.push(n)}),r}function has(t,e){if(!isArray(e))return null!=t&&hasOwnProperty.call(t,e);for(var r=e.length,n=0;n<r;n++){var i=e[n];if(null==t||!hasOwnProperty.call(t,i))return!1;t=t[i]}return!!r}function inArray(t,e){if(!e)return-1;var r;if(e.indexOf)return e.indexOf(t);for(r=e.length;r--;)if(e[r]===t)return r;return-1}function inherit(t,e){var r=function(){};r.prototype=e.prototype,t.prototype=new r}function isArray(t){return t&&t.constructor===Array}function isArrayLike(t){return!isString(t)&&!isHtmlNode(t)&&"number"==typeof t.length}function isBoolean(t){return"boolean"==typeof t}function isDocument(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function isEqual(t,e){return eq(t,e)}function isFunction(t){return"function"==type(t)}function isObject(t){return"object"==type(t)}function isPlainObject(t){return isObject(t)&&!isWindow(t)&&Object.getPrototypeOf(t)==Object.prototype}function isString(t){return"string"==typeof t}function isWindow(t){return t&&t==t.window}function isDefined(t){return"undefined"!=typeof t}function isHtmlNode(t){return t&&t instanceof Node}function isInstanceOf(t,e){return t!==undefined&&(null===t||e==Object||("number"==typeof t?e===Number:"string"==typeof t?e===String:"boolean"==typeof t?e===Boolean:"string"==typeof t?e===String:t instanceof e||!(!t||!t.isInstanceOf)&&t.isInstanceOf(e)))}function isNumber(t){return"number"==typeof t}function isSameOrigin(t){if(t){var e=location.protocol+"//"+location.hostname;return location.port&&(e+=":"+location.port),t.startsWith(e)}}function isEmptyObject(t){var e;for(e in t)if(null!==t[e])return!1;return!0}function isMatch(t,e){var r=r(e),n=r.length;if(null==t)return!n;for(var i=Object(t),o=0;o<n;o++){var s=r[o];if(e[s]!==i[s]||!(s in i))return!1}return!0}function keys(t){if(isObject(t))return[];var e=[];for(var r in t)has(t,r)&&e.push(r);return e}function makeArray(t,e,r){return isArrayLike(t)?(r||[]).concat(Array.prototype.slice.call(t,e||0)):[t]}function map(t,e){var r,n,i,o=[];if(isArrayLike(t))for(n=0;n<t.length;n++)r=e.call(t[n],t[n],n),null!=r&&o.push(r);else for(i in t)r=e.call(t[i],t[i],i),null!=r&&o.push(r);return flatten(o)}function defer(t){return requestAnimationFrame?requestAnimationFrame(t):setTimeoutout(t),this}function noop(){}function proxy(t,e){var r=2 in arguments&&slice.call(arguments,2);if(isFunction(t)){var n=function(){return t.apply(e,r?r.concat(slice.call(arguments)):arguments)};return n}if(isString(e))return r?(r.unshift(t[e],t),proxy.apply(null,r)):proxy(t[e],t);throw new TypeError("expected function")}function toPixel(t){return parseFloat(t)||0}function trim(t){return null==t?"":String.prototype.trim.call(t)}function removeItem(t,e){if(isArray(t)){var r=t.indexOf(e);r!=-1&&t.splice(r,1)}else if(isPlainObject(t))for(var n in t)if(t[n]==e){delete t[n];break}return this}function _mixin(t,e,r,n){for(var i in e)e.hasOwnProperty(i)&&(n&&t[i]!==undefined||(r&&(isPlainObject(e[i])||isArray(e[i]))?(isPlainObject(e[i])&&!isPlainObject(t[i])&&(t[i]={}),isArray(e[i])&&!isArray(t[i])&&(t[i]=[]),_mixin(t[i],e[i],r,n)):e[i]!==undefined&&(t[i]=e[i])));return t}function _parseMixinArgs(t){var e=slice.call(arguments,0),r=e.shift(),n=!1;return isBoolean(e[e.length-1])&&(n=e.pop()),{target:r,sources:e,deep:n}}function mixin(){var t=_parseMixinArgs.apply(this,arguments);return t.sources.forEach(function(e){_mixin(t.target,e,t.deep,!1)}),t.target}function result(t,e,r){isArray(e)||(e=[e]);var n=e.length;if(!n)return isFunction(r)?r.call(t):r;for(var i=0;i<n;i++){var o=null==t?void 0:t[e[i]];void 0===o&&(o=r,i=n),t=isFunction(o)?o.call(t):o}return t}function safeMixin(){var t=_parseMixinArgs.apply(this,arguments);return t.sources.forEach(function(e){_mixin(t.target,e,t.deep,!0)}),t.target}function substitute(t,e,r,n){function i(t,e){if(t.match(/\./)){var r,n=function(t,e){var i=t.pop();return i?e[i]?n(t,r=e[i]):null:r};return n(t.split(".").reverse(),e)}return e[t]}return n=n||window,r=r?proxy(n,r):function(t){return t},t.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,function(t,o,s){var a=i(o,e);return s&&(a=i(s,n).call(n,a,o)),r(a,o).toString()})}function uid(t){return t._uid||(t._uid=_uid++)}function uniq(t){return filter.call(t,function(e,r){return t.indexOf(e)==r})}function uniqueId(t){var e=++idCounter+"";return t?t+e:e}function langx(){return langx}var toString={}.toString,concat=Array.prototype.concat,indexOf=Array.prototype.indexOf,slice=Array.prototype.slice,filter=Array.prototype.filter,hasOwnProperty=Object.prototype.hasOwnProperty,PGLISTENERS=Symbol?Symbol():"__pglisteners",eq,deepEq,SymbolProto="undefined"!=typeof Symbol?Symbol.prototype:null;eq=function(t,e,r,n){if(t===e)return 0!==t||1/t===1/e;if(null==t||null==e)return!1;if(t!==t)return e!==e;var i=typeof t;return("function"===i||"object"===i||"object"==typeof e)&&deepEq(t,e,r,n)},deepEq=function(t,e,r,n){var i=toString.call(t);if(i!==toString.call(e))return!1;switch(i){case"[object RegExp]":case"[object String]":return""+t==""+e;case"[object Number]":return+t!==+t?+e!==+e:0===+t?1/+t===1/e:+t===+e;case"[object Date]":case"[object Boolean]":return+t===+e;case"[object Symbol]":return SymbolProto.valueOf.call(t)===SymbolProto.valueOf.call(e)}var o="[object Array]"===i;if(!o){if("object"!=typeof t||"object"!=typeof e)return!1;var s=t.constructor,a=e.constructor;if(s!==a&&!(isFunction(s)&&s instanceof s&&isFunction(a)&&a instanceof a)&&"constructor"in t&&"constructor"in e)return!1}r=r||[],n=n||[];for(var u=r.length;u--;)if(r[u]===t)return n[u]===e;if(r.push(t),n.push(e),o){if(u=t.length,u!==e.length)return!1;for(;u--;)if(!eq(t[u],e[u],r,n))return!1}else{var c,f=Object.keys(t);if(u=f.length,Object.keys(e).length!==u)return!1;for(;u--;)if(c=f[u],e[c]===undefined||!eq(t[c],e[c],r,n))return!1}return r.pop(),n.pop(),!0};var undefined,nextId=0,f1=function(){function t(t,e,r){var n=t.prototype,i=t.superclass.prototype,o=r&&r.noOverrided;for(var s in e)if("constructor"!==s){var a=e[s];"function"==typeof e[s]?n[s]=a._constructor||o||"function"!=typeof i[s]?a:function(t,e,r){return function(){var t=this.overrided;this.overrided=r;var n=e.apply(this,arguments);return this.overrided=t,n}}(s,a,i[s]):"object"!=typeof a||null===a||!a.get&&a.value===undefined?n[s]=a:Object.defineProperty(n,s,a)}return t}function e(t,e){var r=[];return e.forEach(function(t){if(has(t,"__mixins__"))throw new Error("nested mixins");for(var e=[];t;)e.unshift(t),t=t.superclass;r=r.concat(e)}),r=uniq(r),r=r.filter(function(e){for(var r=t;r;){if(e===r)return!1;if(has(r,"__mixins__"))for(var n=r.__mixins__,i=0;i<n.length;i++)if(n[i]===e)return!1;r=r.superclass}return!0}),r.length>0&&r}function r(t,e){for(var r=t,n=0;n<e.length;n++){var i=new Function;i.prototype=Object.create(r.prototype),i.__proto__=r,i.superclass=null,mixin(i.prototype,e[n].prototype),i.prototype.__mixin__=e[n],r=i}return r}return function n(i,o,s,a){isArray(o)&&(a=s,s=o,o=null),o=o||Object,isDefined(s)&&!isArray(s)&&(a=s,s=!1);var u=o;s&&(s=e(u,s)),s&&(u=r(u,s));var c=i.constructor;c===Object&&(c=function(){if(this.init)return this.init.apply(this,arguments)});var f=i.klassName||"",l=new Function("return function "+f+"() {var inst = this, ctor = arguments.callee;if (!(inst instanceof ctor)) {inst = Object.create(ctor.prototype);}return ctor._constructor.apply(inst, arguments) || inst;}")();return l._constructor=c,l.prototype=Object.create(u.prototype),l.prototype.constructor=l,l.superclass=o,l.__proto__=u,s&&(l.__mixins__=s),l.partial||(l.partial=function(e,r){return t(this,e,r)}),l.inherit||(l.inherit=function(t,e,r){return n(t,this,e,r)}),l.partial(i,a),l}},createClass=f1(),delegate=function(){function t(){}return function(e,r){t.prototype=e;var n=new t;return t.prototype=null,r&&mixin(n,r),n}}(),getAbsoluteUrl=function(){var t;return function(e){return t||(t=document.createElement("a")),t.href=e,t.href}}(),type=function(){var t={};return each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,r){t["[object "+r+"]"]=r.toLowerCase()}),function(e){return null==e?String(e):t[toString.call(e)]||"object"}}(),_uid=1,idCounter=0,Deferred=function(){var t=this,e=this.promise=new Promise(function(e,r){t._resolve=e,t._reject=r}),r={state:function(){return t.isResolved()?"resolved":t.isRejected()?"rejected":"pending"},then:function(t,e,n){return n&&this.progress(n),mixin(Promise.prototype.then.call(this,t&&function(e){return e&&e.__ctx__!==undefined?t.apply(e.__ctx__,e):t(e)},e&&function(t){return t&&t.__ctx__!==undefined?e.apply(t.__ctx__,t):e(t)}),r)},always:function(t){return this.then(t,t),this},done:function(t){return this.then(t)},fail:function(t){return this.then(null,t)},progress:function(e){return t[PGLISTENERS].push(e),this}};r.pipe=r.then,mixin(e,r),this[PGLISTENERS]=[]};Deferred.prototype.resolve=function(t){var e=slice.call(arguments);return this.resolveWith(null,e)},Deferred.prototype.resolveWith=function(t,e){return e=e?makeArray(e):[],e.__ctx__=t,this._resolve(e),this._resolved=!0,this},Deferred.prototype.progress=function(t){try{return this[PGLISTENERS].forEach(function(e){return e(t)})}catch(e){this.reject(e)}return this},Deferred.prototype.reject=function(t){var e=slice.call(arguments);return this.rejectWith(null,e)},Deferred.prototype.rejectWith=function(t,e){return e=e?makeArray(e):[],e.__ctx__=t,this._reject(e),this._rejected=!0,this},Deferred.prototype.isResolved=function(){return!!this._resolved},Deferred.prototype.isRejected=function(){return!!this._rejected},Deferred.prototype.then=function(t,e,r){var n=result(this,"promise");return n.then(t,e,r)},Deferred.prototype.done=Deferred.prototype.then,Deferred.all=function(t){return Promise.all(t)},Deferred.first=function(t){return Promise.race(t)},Deferred.when=function(t,e,r,n){var i=t&&"function"==typeof t.then,o=i&&t instanceof Promise;if(!i)return arguments.length>1?e?e(t):t:(new Deferred).resolve(t);if(!o){var s=new Deferred(t.cancel);t.then(s.resolve,s.reject,s.progress),t=s.promise}return e||r||n?t.then(e,r,n):t},Deferred.reject=function(t){var e=new Deferred;return e.reject(t),e.promise},Deferred.resolve=function(t){var e=new Deferred;return e.resolve(t),e.promise},Deferred.immediate=Deferred.resolve;var Evented=createClass({on:function(t,e,r,n,i,o){var s=this,a=this._hub||(this._hub={});return isPlainObject(t)?(i=n,each(t,function(t,n){s.on(t,e,r,n,i,o)}),this):(isString(e)||isFunction(n)||(i=n,n=r,r=e,e=undefined),isFunction(r)&&(i=n,n=r,r=null),isString(t)&&(t=t.split(/\s/)),t.forEach(function(t){(a[t]||(a[t]=[])).push({fn:n,selector:e,data:r,ctx:i,one:o})}),this)},one:function(t,e,r,n,i){return this.on(t,e,r,n,i,1)},trigger:function(t){if(!this._hub)return this;var e=this;isString(t)&&(t=new CustomEvent(t)),Object.defineProperty(t,"target",{value:this});var r=slice.call(arguments,1);return r=isDefined(r)?[t].concat(r):[t],[t.type||t.name,"all"].forEach(function(n){var i=e._hub[n];if(i){for(var o=i.length,s=!1,a=0;a<o;a++){var u=i[a];t.data?u.data&&(t.data=mixin({},u.data,t.data)):t.data=u.data||null,u.fn.apply(u.ctx,r),u.one&&(i[a]=null,s=!0)}s&&(e._hub[n]=compact(i))}}),this},listened:function(t){var e=(this._hub||(this._events={}))[t]||[];return e.length>0},listenTo:function(t,e,r,n){if(!t)return this;isString(r)&&(r=this[r]),n?t.one(e,r,this):t.on(e,r,this);for(var i,o=this._listeningTo||(this._listeningTo=[]),s=0;s<o.length;s++)if(o[s].obj==t){i=o[s];break}i||o.push(i={obj:t,events:{}});var a=i.events,u=a[e]=a[e]||[];return u.indexOf(r)==-1&&u.push(r),this},listenToOnce:function(t,e,r){return this.listenTo(t,e,r,1)},off:function(t,e){var r=this._hub||(this._hub={});return isString(t)&&(t=t.split(/\s/)),t.forEach(function(t){var n=r[t],i=[];if(n&&e)for(var o=0,s=n.length;o<s;o++)n[o].fn!==e&&n[o].fn._!==e&&i.push(n[o]);i.length?r[t]=i:delete r[t]}),this},unlistenTo:function(t,e,r){var n=this._listeningTo;if(!n)return this;for(var i=0;i<n.length;i++){var o=n[i];if(!t||t==o.obj){var s=o.events;for(var a in s)if(!e||e==a){listeningEvent=s[a];for(var u=0;u<listeningEvent.length;u++)r&&r!=listeningEvent[i]||(o.obj.off(a,listeningEvent[i],this),listeningEvent[i]=null);listeningEvent=s[a]=compact(listeningEvent),isEmptyObject(listeningEvent)&&(s[a]=null)}isEmptyObject(s)&&(n[i]=null)}}return n=this._listeningTo=compact(n),isEmptyObject(n)&&(this._listeningTo=null),this}}),Stateful=Evented.inherit({init:function(t,e){var r=t||{};e||(e={}),this.cid=uniqueId(this.cidPrefix),this.attributes={},e.collection&&(this.collection=e.collection),e.parse&&(r=this.parse(r,e)||{});var n=result(this,"defaults");r=mixin({},n,r),this.set(r,e),this.changed={}},changed:null,validationError:null,idAttribute:"id",cidPrefix:"c",toJSON:function(t){return clone(this.attributes)},get:function(t){return this.attributes[t]},has:function(t){return null!=this.get(t)},set:function(t,e,r){if(null==t)return this;var n;if("object"==typeof t?(n=t,r=e):(n={})[t]=e,r||(r={}),!this._validate(n,r))return!1;var i=r.unset,o=r.silent,s=[],a=this._changing;this._changing=!0,a||(this._previousAttributes=clone(this.attributes),this.changed={});var u=this.attributes,c=this.changed,f=this._previousAttributes;for(var l in n)e=n[l],isEqual(u[l],e)||s.push(l),isEqual(f[l],e)?delete c[l]:c[l]=e,i?delete u[l]:u[l]=e;if(this.idAttribute in n&&(this.id=this.get(this.idAttribute)),!o){s.length&&(this._pending=r);for(var p=0;p<s.length;p++)this.trigger("change:"+s[p],this,u[s[p]],r)}if(a)return this;if(!o)for(;this._pending;)r=this._pending,this._pending=!1,this.trigger("change",this,r);return this._pending=!1,this._changing=!1,this},unset:function(t,e){return this.set(t,void 0,mixin({},e,{unset:!0}))},clear:function(t){var e={};for(var r in this.attributes)e[r]=void 0;return this.set(e,mixin({},t,{unset:!0}))},hasChanged:function(t){return null==t?!isEmptyObject(this.changed):this.changed[t]!==undefined},changedAttributes:function(t){if(!t)return!!this.hasChanged()&&clone(this.changed);var e=this._changing?this._previousAttributes:this.attributes,r={};for(var n in t){var i=t[n];isEqual(e[n],i)||(r[n]=i)}return!isEmptyObject(r)&&r},previous:function(t){return null!=t&&this._previousAttributes?this._previousAttributes[t]:null},previousAttributes:function(){return clone(this._previousAttributes)},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(t){return this._validate({},mixin({},t,{validate:!0}))},_validate:function(t,e){if(!e.validate||!this.validate)return!0;t=mixin({},this.attributes,t);var r=this.validationError=this.validate(t,e)||null;return!r||(this.trigger("invalid",this,r,mixin(e,{validationError:r})),!1)}}),SimpleQueryEngine=function(t,e){function r(t,e,r){var n,i=0,o=t&&t.length||0,s=[];if(o&&"string"==typeof t&&(t=t.split("")),"string"==typeof e&&(e=cache[e]||buildFn(e)),r)for(;i<o;++i)n=t[i],e.call(r,n,i,t)&&s.push(n);else for(;i<o;++i)n=t[i],e(n,i,t)&&s.push(n);return s}function n(n){var i=r(n,t),o=e&&e.sort;if(o&&i.sort("function"==typeof o?o:function(t,e){for(var r,n=0;r=o[n];n++){var i=t[r.attribute],s=e[r.attribute];if(i=null!=i?i.valueOf():i,s=null!=s?s.valueOf():s,i!=s)return!!r.descending==(null==i||i>s)?-1:1}return 0}),e&&(e.start||e.count)){var s=i.length;i=i.slice(e.start||0,(e.start||0)+(e.count||1/0)),i.total=s}return i}switch(typeof t){default:throw new Error("Can not query with a "+typeof t);case"object":case"undefined":var i=t;t=function(t){for(var e in i){var r=i[e];if(r&&r.test){if(!r.test(t[e],t))return!1}else if(r!=t[e])return!1}return!0};break;case"string":if(!this[t])throw new Error("No filter function "+t+" was found in store");t=this[t];case"function":}return n.matches=t,n},QueryResults=function(t){function e(e){t[e]=function(){var n=arguments,i=Deferred.when(t,function(t){return QueryResults(Array.prototype[e].apply(t,n))});if("forEach"!==e||r)return i}}if(!t)return t;var r=!!t.then;return r&&(t=Object.delegate(t)),e("forEach"),e("filter"),e("map"),null==t.total&&(t.total=Deferred.when(t,function(t){return t.length})),t},ArrayStore=createClass({"klassName-":"ArrayStore",queryEngine:SimpleQueryEngine,idProperty:"id",get:function(t){return this.data[this.index[t]]},getIdentity:function(t){return t[this.idProperty]},put:function(t,e){var r=this.data,n=this.index,i=this.idProperty,o=t[i]=e&&"id"in e?e.id:i in t?t[i]:Math.random();if(o in n){if(e&&e.overwrite===!1)throw new Error("Object already exists");r[n[o]]=t}else n[o]=r.push(t)-1;return o},add:function(t,e){return(e=e||{}).overwrite=!1,this.put(t,e)},remove:function(t){var e=this.index,r=this.data;if(t in e)return r.splice(e[t],1),this.setData(r),!0},query:function(t,e){return QueryResults(this.queryEngine(t,e)(this.data))},setData:function(t){t.items?(this.idProperty=t.identifier||this.idProperty,t=this.data=t.items):this.data=t,this.index={};for(var e=0,r=t.length;e<r;e++)this.index[t[e][this.idProperty]]=e},init:function(t){for(var e in t)this[e]=t[e];this.setData(this.data||[])}}),Xhr=function(){function mimeToDataType(t){if(t&&(t=t.split(";",2)[0]),t){if(t==htmlType)return"html";if(t==jsonType)return"json";if(scriptTypeRE.test(t))return"script";if(xmlTypeRE.test(t))return"xml"}return"text"}function appendQuery(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function serializeData(t){t.data=t.data||t.query,t.processData&&t.data&&"string"!=type(t.data)&&(t.data=param(t.data,t.traditional)),!t.data||t.type&&"GET"!=t.type.toUpperCase()||(t.url=appendQuery(t.url,t.data),t.data=undefined)}function serialize(t,e,r,n){var i,o=isArray(e),s=isPlainObject(e);each(e,function(e,a){i=type(a),n&&(e=r?n:n+"["+(s||"object"==i||"array"==i?e:"")+"]"),!n&&o?t.add(a.name,a.value):"array"==i||!r&&"object"==i?serialize(t,a,r,e):t.add(e,a)})}var jsonpID=0,document=window.document,key,name,rscript=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,scriptTypeRE=/^(?:text|application)\/javascript/i,xmlTypeRE=/^(?:text|application)\/xml/i,jsonType="application/json",htmlType="text/html",blankRE=/^\s*$/,XhrDefaultOptions={async:!0,type:"GET",beforeSend:noop,success:noop,error:noop,complete:noop,context:null,global:!0,accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:"application/json",xml:"application/xml, text/xml",html:"text/html",text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0,xhrFields:{withCredentials:!0}},param=function(t,e){var r=[];return r.add=function(t,e){isFunction(e)&&(e=e()),null==e&&(e=""),this.push(escape(t)+"="+escape(e))},serialize(r,t,e),r.join("&").replace(/%20/g,"+")},Xhr=Evented.inherit({klassName:"Xhr",_request:function(args){var _=this._,self=this,options=mixin({},XhrDefaultOptions,_.options,args),xhr=_.xhr=new XMLHttpRequest;serializeData(options);var dataType=options.dataType||options.handleAs,mime=options.mimeType||options.accepts[dataType],headers=options.headers,xhrFields=options.xhrFields,isFormData=options.data&&options.data instanceof FormData,basicAuthorizationToken=options.basicAuthorizationToken,type=options.type,url=options.url,async=options.async,user=options.user,password=options.password,deferred=new Deferred,contentType=!isFormData&&"application/x-www-form-urlencoded";if(xhrFields)for(name in xhrFields)xhr[name]=xhrFields[name];mime&&mime.indexOf(",")>-1&&(mime=mime.split(",",2)[0]),mime&&xhr.overrideMimeType&&xhr.overrideMimeType(mime);var finish=function(){xhr.onloadend=noop,xhr.onabort=noop,xhr.onprogress=noop,xhr.ontimeout=noop,xhr=null},onloadend=function(){var result,error=!1;if(xhr.status>=200&&xhr.status<300||304==xhr.status||0==xhr.status&&url.startsWith("file:")){dataType=dataType||mimeToDataType(options.mimeType||xhr.getResponseHeader("content-type")),result=xhr.responseText;try{"script"==dataType?eval(result):"xml"==dataType?result=xhr.responseXML:"json"==dataType?result=blankRE.test(result)?null:JSON.parse(result):"blob"==dataType?result=Blob([xhrObj.response]):"arraybuffer"==dataType&&(result=xhr.reponse)}catch(e){error=e}error?deferred.reject(error,xhr.status,xhr):deferred.resolve(result,xhr.status,xhr)}else deferred.reject(new Error(xhr.statusText),xhr.status,xhr);finish()},onabort=function(){deferred&&deferred.reject(new Error("abort"),xhr.status,xhr),finish()},ontimeout=function(){deferred&&deferred.reject(new Error("timeout"),xhr.status,xhr),finish()},onprogress=function(t){deferred&&deferred.progress(t,xhr.status,xhr)};if(xhr.onloadend=onloadend,xhr.onabort=onabort,xhr.ontimeout=ontimeout,xhr.onprogress=onprogress,xhr.open(type,url,async,user,password),headers)for(var key in headers){var value=headers[key];"content-type"===key.toLowerCase()?contentType=headers[hdr]:xhr.setRequestHeader(key,value)}return contentType&&contentType!==!1&&xhr.setRequestHeader("Content-Type",contentType),headers&&"X-Requested-With"in headers||xhr.setRequestHeader("X-Requested-With","XMLHttpRequest"),basicAuthorizationToken&&xhr.setRequestHeader("Authorization",basicAuthorizationToken),xhr.send(options.data?options.data:null),deferred.promise},abort:function(){var t=this._,e=t.xhr;e&&e.abort()},request:function(t){return this._request(t)},get:function(t){return t=t||{},t.type="GET",this._request(t)},post:function(t){return t=t||{},t.type="POST",this._request(t)},patch:function(t){return t=t||{},t.type="PATCH",this._request(t)},put:function(t){return t=t||{},t.type="PUT",this._request(t)},del:function(t){return t=t||{},t.type="DELETE",this._request(t)},init:function(t){this._={options:t||{}}}});return["request","get","post","put","del","patch"].forEach(function(t){Xhr[t]=function(e,r){var n=new Xhr({url:e});return n[t](r)}}),Xhr.defaultOptions=XhrDefaultOptions,Xhr.param=param,Xhr}(),Restful=Evented.inherit({klassName:"Restful",idAttribute:"id",getBaseUrl:function(t){var e=String.substitute(this.baseEndpoint,t),r=this.server+this.basePath+e;return t[this.idAttribute]!==undefined&&(r=r+"/"+t[this.idAttribute]),r},_head:function(t){},_get:function(t){return Xhr.get(this.getBaseUrl(t),t)},_post:function(t,e){var r=this.getBaseUrl(t);return e&&(r=r+"/"+e),Xhr.post(r,t)},_put:function(t,e){var r=this.getBaseUrl(t);return e&&(r=r+"/"+e),Xhr.put(r,t)},_delete:function(t){var e=this.getBaseUrl(t);return Xhr.del(e)},_patch:function(t){var e=this.getBaseUrl(t);return Xhr.patch(e,t)},query:function(t){return this._post(t)},retrieve:function(t){return this._get(t)},create:function(t){return this._post(t)},update:function(t){return this._put(t)},"delete":function(t){return this._delete(t)},patch:function(t){return this._patch(t)},init:function(t){mixin(this,t)}});return mixin(langx,{after:aspect("after"),allKeys:allKeys,around:aspect("around"),ArrayStore:ArrayStore,before:aspect("before"),camelCase:function(t){return t.replace(/-([\da-z])/g,function(t){return t.toUpperCase().replace("-","")})},clone:clone,compact:compact,createEvent:createEvent,dasherize:dasherize,debounce:debounce,defaults:createAssigner(allKeys,!0),delegate:delegate,Deferred:Deferred,Evented:Evented,defer:defer,deserializeValue:deserializeValue,each:each,first:function(t,e){return e?t.slice(0,e):t[0]},flatten:flatten,funcArg:funcArg,getQueryParams:getQueryParams,has:has,inArray:inArray,isArray:isArray,isArrayLike:isArrayLike,isBoolean:isBoolean,isDefined:function(t){return t!==undefined},isDocument:isDocument,isEmptyObject:isEmptyObject,isEqual:isEqual,isFunction:isFunction,isHtmlNode:isHtmlNode,isMatch:isMatch,isNumber:isNumber,isObject:isObject,isPlainObject:isPlainObject,isString:isString,isSameOrigin:isSameOrigin,isWindow:isWindow,keys:keys,klass:function(t,e,r,n){return createClass(t,e,r,n)},lowerFirst:function(t){return t.charAt(0).toLowerCase()+t.slice(1)},makeArray:makeArray,map:map,mixin:mixin,noop:noop,proxy:proxy,removeItem:removeItem,Restful:Restful,result:result,returnTrue:function(){return!0},returnFalse:function(){return!1},safeMixin:safeMixin,serializeValue:function(t){return JSON.stringify(t)},Stateful:Stateful,substitute:substitute,toPixel:toPixel,trim:trim,type:type,uid:uid,uniq:uniq,uniqueId:uniqueId,upperFirst:function(t){return t.charAt(0).toUpperCase()+t.slice(1)},URL:"undefined"!=typeof window?window.URL||window.webkitURL:null,values:values,Xhr:Xhr}),skylark.langx=langx}),define("skylark-router/router",["skylark-langx/skylark","skylark-langx/langx"],function(t,e){function r(t,r){var n=new CustomEvent(t,r);return e.safeMixin(n,r)}function n(){return v}function i(t){if(v){var n=v.route.exit({path:v.path,params:v.params},!0);if(!n)return}if(y=v,v=t,!v.route){var i=s(v.path);v.route=i.route,v.params=i.params}var o=v.route.enter({force:v.force,path:v.path,params:v.params},!0);e.Deferred.when(o).then(function(){_.trigger(r("routing",{current:v,previous:y})),v.route.enter({path:v.path,params:v.params},!1),y&&y.route.exit({path:y.path,params:y.params},!1),_.trigger(r("routed",{current:v,previous:y}))})}function o(t,e){if(!e&&v&&v.path==t)return!1;var n=s(t);if(n)if(n.path=t,j.useHistoryApi){var o={force:e,path:t};window.history.pushState(o,document.title,(g+t).replace("//","/")),window.dispatchEvent(r("popstate",{state:o}))}else if(j.useHashbang){var a="#!"+t;window.location.hash!==a?window.location.hash=a:i(n)}else i(n);return!0}function s(t,r){var n=!1;return!r&&(n=b[t])?n:(e.each(x,function(e,r){var i=r.match(t);return!i||(n={route:r,params:i},!1)}),n&&!r&&(b[t]=n),n)}function a(t,e){var r,n=x[t];return n&&(r=n.path(e)),r}function u(){return y}function c(t){return e.isDefined(t)?(g=t,this):g}function f(){return _}function l(t){return e.isDefined(t)?(m=t,this):m}function p(t,r){if(e.isDefined(r)){var n={};return n[t]=r,h(n),this}return x[t]}function h(t){if(!e.isDefined(t))return e.mixin({},x);for(var r in t)x[r]=new j.Route(r,t[r])}function d(){null==j.useHashbang&&null==j.useHistoryApi&&(window.location.host&&window.history.pushState?j.useHistoryApi=!0:j.useHashbang=!0);var t="";j.useHistoryApi?(t=window.location.pathname,void 0===g&&(g=t.replace(/\/$/,"")),t=t.replace(g,"")||m||"/"):t=j.useHashbang?window.location.hash.replace("#!","")||m||"/":"/",t.startsWith("/")||(t="/"+t),j.useHistoryApi?window.addEventListener("popstate",function(t){t.state&&i(t.state),t.preventDefault()}):j.useHashbang&&window.addEventListener("hashchange",function(t){i({path:window.location.hash.replace(/^#!/,"")}),t.preventDefault()}),o(t)}var v,y,g,m,x={},b={},_=new e.Evented,w=e.Evented.inherit({klassName:"Route",init:function(t,r){r=e.mixin({},r);var n=r.pathto||"",i=n,o=i.match(/\:([a-zA-Z0-9_]+)/g);null!==o?(o=o.map(function(t){return t.substring(1)}),i=i.replace(/\:([a-zA-Z0-9_]+)/g,"(.*?)")):o=[],i="*"===i?"(.*)":i.replace("/","\\/"),this._setting=r,this.name=t,this.pathto=n,this.paramNames=o,this.params=i,this.regex=new RegExp("^"+i+"$","");var s=this;["entering","entered","exiting","exited"].forEach(function(t){e.isFunction(r[t])&&s.on(t,r[t])})},enter:function(t,n){if(n){var i=this._entering(t),o=this;return e.Deferred.when(i).then(function(){var t=r("entering",{route:o,result:!0});return o.trigger(t),t.result})}return this._entered(t),this.trigger(r("entered",e.safeMixin({route:this},t))),this},exit:function(t,n){if(n){var i=this._exiting(t);if(!i)return!1;var o=r("exiting",{route:this,result:!0});return this.trigger(o),o.result}return this._exited(t),this.trigger(r("exited",e.safeMixin({route:this},t))),this},match:function(t){var e=this.paramNames,r=t.indexOf("?"),t=~r?t.slice(0,r):decodeURIComponent(t),n=this.regex.exec(t);if(!n)return!1;for(var i={},o=1,s=n.length;o<s;++o){var a=e[o-1],u=decodeURIComponent(n[o]);i[a]=u}return i},path:function(t){var e=this.pathto;return t&&(e=e.replace(/:([a-zA-Z0-9_]+)/g,function(e,r){return t[r]})),e},_entering:function(t){return!0},_entered:function(t){return!0},_exiting:function(t){return!0},_exited:function(t){return!0}}),j=function(){return j};return e.mixin(j,{Route:w,current:n,go:o,map:s,hub:f,off:function(){_.off.apply(_,arguments)},on:function(){_.on.apply(_,arguments)},one:function(){_.one.apply(_,arguments)},path:a,previous:u,baseUrl:c,homePath:l,route:p,routes:h,start:d,trigger:function(t){return _.trigger(t),this},useHistoryApi:null,useHashbang:null}),t.router=j}),define("skylark-router/main",["skylark-langx/skylark","./router"],function(t){return t}),define("skylark-router",["skylark-router/main"],function(t){
return t})},this);
//# sourceMappingURL=sourcemaps/skylark-router-all.js.map

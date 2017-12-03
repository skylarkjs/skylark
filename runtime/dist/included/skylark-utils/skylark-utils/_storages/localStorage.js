/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../langx"],function(e){function t(){return t}var n=null;try{n=window.localStorage}catch(r){}return e.mixin(t,{isSupported:function(){return!!n},set:function(t,r){return void 0===r?this.remove(t):(n.setItem(t,e.serializeValue(r)),r)},get:function(t,r){var i=e.deserializeValue(n.getItem(t));return void 0===i?r:i},remove:function(e){n.removeItem(e)},clear:function(){n.clear()},forEach:function(e){for(var t=0;t<n.length;t++){var r=n.key(t);e(r,store.get(r))}}}),t});
//# sourceMappingURL=../sourcemaps/_storages/localStorage.js.map

/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.3
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../langx"],function(e){function n(){return n}var t=null;try{t=window.sessiionStorage}catch(r){}return e.mixin(n,{isSupported:function(){return!!t},set:function(n,r){return void 0===r?this.remove(n):(t.setItem(n,e.serializeValue(r)),r)},get:function(n,r){var i=e.deserializeValue(t.getItem(n));return void 0===i?r:i},remove:function(e){t.removeItem(e)},clear:function(){t.clear()},forEach:function(e){for(var n=0;n<t.length;n++){var r=t.key(n);e(r,store.get(r))}}}),n});
//# sourceMappingURL=../sourcemaps/_storages/sessionStorage.js.map

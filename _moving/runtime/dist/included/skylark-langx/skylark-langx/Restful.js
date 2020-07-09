/**
 * skylark-langx - A simple JavaScript language extension library, including class support, Evented class, Deferred class and some commonly used tool functions.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./Evented","./objects","./strings","./Xhr"],function(t,e,i,n){var r=e.mixin,u=i.substitute,s=t.inherit({klassName:"Restful",idAttribute:"id",getBaseUrl:function(t){var e=u(this.baseEndpoint,t),i=this.server+this.basePath+e;return void 0!==t[this.idAttribute]&&(i=i+"/"+t[this.idAttribute]),i},_head:function(t){},_get:function(t){return n.get(this.getBaseUrl(t),t)},_post:function(t,e){var i=this.getBaseUrl(t);return e&&(i=i+"/"+e),n.post(i,t)},_put:function(t,e){var i=this.getBaseUrl(t);return e&&(i=i+"/"+e),n.put(i,t)},_delete:function(t){var e=this.getBaseUrl(t);return n.del(e)},_patch:function(t){var e=this.getBaseUrl(t);return n.patch(e,t)},query:function(t){return this._post(t)},retrieve:function(t){return this._get(t)},create:function(t){return this._post(t)},update:function(t){return this._put(t)},"delete":function(t){return this._delete(t)},patch:function(t){return this._patch(t)},init:function(t){r(this,t)}});return s});
//# sourceMappingURL=sourcemaps/Restful.js.map

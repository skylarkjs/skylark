/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./noder","./datax","./styler","./geom","./eventer","./query","./velm"],function(e,t,i,n,s,r,l,u,h){function a(){return a}function o(e,t,i){}var c=/^(\S+)\s*(.*)$/,d=(Array.prototype.slice,t.Evented.inherit({init:function(e,i){if(t.isHtmlNode(e)){var e=i;i=e}t.isHtmlNode(i)?this.el=i:this.el=null,e&&t.mixin(this,e),this.cid||(this.cid=t.uniqueId("w")),this._ensureElement()},tagName:"div",$:function(e){return this.$el.find(e)},render:function(){return this},remove:function(){return this._removeElement(),this.unlistenTo(),this},_removeElement:function(){this.$el.remove()},setElement:function(e){return this.undelegateEvents(),this._setElement(e),this.delegateEvents(),this},_setElement:function(e){this.$el=a.$(e),this.el=this.$el[0]},delegateEvents:function(e){if(e||(e=t.result(this,"events")),!e)return this;this.undelegateEvents();for(var i in e){var n=e[i];if(t.isFunction(n)||(n=this[n]),n){var s=i.match(c);this.delegate(s[1],s[2],t.proxy(n,this))}}return this},delegate:function(e,t,i){return this.$el.on(e+".delegateEvents"+this.uid,t,i),this},undelegateEvents:function(){return this.$el&&this.$el.off(".delegateEvents"+this.uid),this},undelegate:function(e,t,i){return this.$el.off(e+".delegateEvents"+this.uid,t,i),this},_createElement:function(e,t){return i.createElement(e,t)},_ensureElement:function(){if(this.el)this.setElement(t.result(this,"el"));else{var e=t.mixin({},t.result(this,"attributes"));this.id&&(e.id=t.result(this,"id")),this.className&&(e["class"]=t.result(this,"className")),this.setElement(this._createElement(t.result(this,"tagName"),e)),this._setAttributes(e)}},_setAttributes:function(e){this.$el.attr(e)},i18n:function(e,i){return e=this.messages&&this.messages[e]||e.toString(),i&&t.each(i,function(t,i){e=e.replace("{"+t+"}",i)}),e}}));return t.mixin(a,{$:u,define:o,Widget:d}),e.widgets=a});
//# sourceMappingURL=sourcemaps/widgets.js.map

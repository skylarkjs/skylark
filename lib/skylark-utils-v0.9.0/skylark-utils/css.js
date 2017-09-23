/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./noder"],function(e,t,r){function l(){var e=document.createElement("link"),t=u++;return e.rel="stylesheet",e.type="text/css",e.async=!1,e.defer=!1,s.appendChild(e),i[t]=e,t}function n(){return n}var a,s=document.getElementsByTagName("head")[0],u=0,o={},i={},c=l(),d=i[c],h="cssRules"in d?"cssRules":"rules",f=d.deleteRule||d.removeRule;if(d.insertRule){var S=d.insertRule;a=function(e,t,r){S.call(this,e+"{"+t+"}",r)}}else a=d.addRule;return t.mixin(n,{createStyleSheet:function(e){return l()},loadStyleSheet:function(e,t,r){var n=o[e];if(n||(n=o[e]={state:0,loadedCallbacks:[],errorCallbacks:[]}),n.loadedCallbacks.push(t),n.errorCallbacks.push(r),1===n.state)n.node.onload();else if(n.state===-1)n.node.onerror();else{n.id=l();var a=n.node=i[n.id];startTime=(new Date).getTime(),a.onload=function(){n.state=1,n.state=-1;for(var e=n.loadedCallbacks,t=e.length;t--;)e[t]();n.loadedCallbacks=[],n.errorCallbacks=[]},a.onerror=function(){n.state=-1;for(var e=n.errorCallbacks,t=e.length;t--;)e[t]();n.loadedCallbacks=[],n.errorCallbacks=[]},a.href=n.url=e,o[a.url]=n}return n.id},deleteSheetRule:function(e,r){var l=i[e];t.isNumber(r)?f.call(l,r):t.each(l[h],function(e,t){if(r===t)return f.call(l,e),!1})},deleteRule:function(e){return this.deleteSheetRule(c,e),this},removeStyleSheet:function(e){if(e===c)throw new Error("The default stylesheet can not be deleted");var t=i[e];return delete i[e],r.remove(t),this},findRules:function(e,t){var r=[],l=parseSelector(e);return $(document.styleSheets).each(function(e,t){filterStyleSheet(l.styleSheet,t)&&$.merge(r,$(t[_rules]).filter(function(){return matchSelector(this,l.selectorText,"*"===l.styleSheet)}).map(function(){return normalizeRule($.support.nativeCSSStyleRule?this:new CSSStyleRule(this),t)}))}),r.reverse()},insertRule:function(e,t,r){return this.insertSheetRule(c,e,t,r)},insertSheetRule:function(e,t,r,l){if(!t||!r)return-1;var n=i[e];return l=l||n[h].length,a.call(n,t,r,l)}}),e.css=n});
//# sourceMappingURL=sourcemaps/css.js.map
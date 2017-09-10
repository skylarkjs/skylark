/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./noder","./finder"],function(e,a,r,t){function l(){return l}var n=document.getElementsByTagName("head")[0],o={},d={},s=0;return a.mixin(l,{loadJavaScript:function(e,a,r){var t=o[e];if(t||(t=o[e]={state:0,loadedCallbacks:[],errorCallbacks:[]}),t.loadedCallbacks.push(a),t.errorCallbacks.push(r),1===t.state)t.node.onload();else if(t.state===-1)t.node.onerror();else{var l=t.node=document.createElement("script"),c=t.id=s++;l.type="text/javascript",l.async=!1,l.defer=!1,startTime=(new Date).getTime(),n.appendChild(l),l.onload=function(){t.state=1;for(var e=t.loadedCallbacks,a=e.length;a--;)e[a]();t.loadedCallbacks=[],t.errorCallbacks=[]},l.onerror=function(){t.state=-1;for(var e=t.errorCallbacks,a=e.length;a--;)e[a]();t.loadedCallbacks=[],t.errorCallbacks=[]},l.src=e,d[c]=l}return t.id},deleteJavaScript:function(e){var a=d[e];if(a){var t=a.src;r.remove(a),delete d[e],delete o[t]}}}),e.scripter=l});
//# sourceMappingURL=sourcemaps/scripter.js.map

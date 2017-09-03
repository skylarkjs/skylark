/**
 * skylark - An Elegant JavaScript Library and HTML5 Application Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark/skylark","skylark/langx","skylark/noder","skylark/finder"],function(e,a,r,l){function t(){return t}var n=document.getElementsByTagName("head")[0],o={},s={},d=0;return a.mixin(t,{loadJavaScript:function(e,a,r){var l=o[e];if(l||(l=o[e]={state:0,loadedCallbacks:[],errorCallbacks:[]}),l.loadedCallbacks.push(a),l.errorCallbacks.push(r),1===l.state)l.node.onload();else if(l.state===-1)l.node.onerror();else{var t=l.node=document.createElement("script"),c=l.id=d++;t.type="text/javascript",t.async=!1,t.defer=!1,startTime=(new Date).getTime(),n.appendChild(t),t.onload=function(){l.state=1;for(var e=l.loadedCallbacks,a=e.length;a--;)e[a]();l.loadedCallbacks=[],l.errorCallbacks=[]},t.onerror=function(){l.state=-1;for(var e=l.errorCallbacks,a=e.length;a--;)e[a]();l.loadedCallbacks=[],l.errorCallbacks=[]},t.src=e,s[c]=t}return l.id},deleteJavaScript:function(e){var a=s[e];if(a){var l=a.src;r.remove(a),delete s[e],delete o[l]}}}),e.scripter=t});
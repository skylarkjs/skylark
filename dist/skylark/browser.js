/**
 * skylark - An Elegant JavaScript Library and HTML5 Application Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark/skylark","skylark/langx"],function(e,r){function t(e){return u?u+e:e.toLowerCase()}function o(e){return w[e]||e}function n(e){return m[e]||e}function i(){return i}var a,c,s="",l="",u="",m={},w={},f=/^(Webkit|webkit|O|Moz|moz|ms)(.*)$/,k=window.document,h=k.createElement("div"),y=h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.matchesSelector,z=h.style;for(var d in z){var v=d.match(c||f);if(v){c||(a=v[1],c=new RegExp("^("+a+")(.*)$"),l=a,s="-"+a.toLowerCase()+"-",u=a.toLowerCase()),m[r.lowerFirst(v[2])]=d;var S=r.dasherize(v[2]);w[S]=s+S}}return r.mixin(i,{css3PropPrefix:s,normalizeStyleProperty:n,normalizeCssProperty:o,normalizeCssEvent:t,matchesSelector:y,location:function(){return window.location}}),h=null,e.browser=i});
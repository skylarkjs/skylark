/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx"],function(e,r){function t(e){return u?u+e:e.toLowerCase()}function o(e){return w[e]||e}function n(e){return m[e]||e}function i(){return i}var a,c,s="",l="",u="",m={},w={},f=/^(Webkit|webkit|O|Moz|moz|ms)(.*)$/,h=window.document,z=h.createElement("div"),d=z.webkitMatchesSelector||z.mozMatchesSelector||z.oMatchesSelector||z.matchesSelector,p=z.style;for(var v in p){var S=v.match(c||f);if(S){c||(a=S[1],c=new RegExp("^("+a+")(.*)$"),l=a,s="-"+a.toLowerCase()+"-",u=a.toLowerCase()),m[r.lowerFirst(S[2])]=v;var k=r.dasherize(S[2]);w[k]=s+k}}return r.mixin(i,{css3PropPrefix:s,normalizeStyleProperty:n,normalizeCssProperty:o,normalizeCssEvent:t,matchesSelector:d,location:function(){return window.location},support:{}}),z=null,e.browser=i});
//# sourceMappingURL=sourcemaps/browser.js.map

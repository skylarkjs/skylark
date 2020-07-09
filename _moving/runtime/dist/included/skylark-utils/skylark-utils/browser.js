/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx"],function(e,r){function t(e){return a?a+e:e.toLowerCase()}function n(e){return w[e]||e}function o(e){return m[e]||e}function l(){return l}var s,c,i="",u="",a="",m={},w={},F=/^(Webkit|webkit|O|Moz|moz|ms)(.*)$/,f=window.document,S=f.createElement("div"),z=S.webkitMatchesSelector||S.mozMatchesSelector||S.oMatchesSelector||S.matchesSelector,x=S.requestFullscreen||S.webkitRequestFullscreen||S.mozRequestFullScreen||S.msRequestFullscreen,d=(f.exitFullscreen||f.webkitCancelFullScreen||f.mozCancelFullScreen||f.msExitFullscreen,S.style);for(var h in d){var k=h.match(c||F);if(k){c||(s=k[1],c=new RegExp("^("+s+")(.*)$"),u=s,i="-"+s.toLowerCase()+"-",a=s.toLowerCase()),m[r.lowerFirst(k[2])]=h;var v=r.dasherize(k[2]);w[v]=i+v}}return r.mixin(l,{css3PropPrefix:i,isIE:!!/msie/i.exec(window.navigator.userAgent),normalizeStyleProperty:o,normalizeCssProperty:n,normalizeCssEvent:t,matchesSelector:z,requestFullScreen:x,exitFullscreen:x,location:function(){return window.location},support:{}}),S=null,e.browser=l});
//# sourceMappingURL=sourcemaps/browser.js.map

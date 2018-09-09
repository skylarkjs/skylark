/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx"],function(e,r){function t(e){return a?a+e:e.toLowerCase()}function n(e){return w[e]||e}function l(e){return m[e]||e}function o(){return o}var c,s,i="",u="",a="",m={},w={},F=/^(Webkit|webkit|O|Moz|moz|ms)(.*)$/,f=window.document,S=f.createElement("div"),z=S.webkitMatchesSelector||S.mozMatchesSelector||S.oMatchesSelector||S.matchesSelector,h=S.requestFullscreen||S.webkitRequestFullscreen||S.mozRequestFullScreen||S.msRequestFullscreen,k=(f.exitFullscreen||f.webkitCancelFullScreen||f.mozCancelFullScreen||f.msExitFullscreen,S.style);for(var x in k){var C=x.match(s||F);if(C){s||(c=C[1],s=new RegExp("^("+c+")(.*)$"),u=c,i="-"+c.toLowerCase()+"-",a=c.toLowerCase()),m[r.lowerFirst(C[2])]=x;var b=r.dasherize(C[2]);w[b]=i+b}}return r.mixin(o,{css3PropPrefix:i,normalizeStyleProperty:l,normalizeCssProperty:n,normalizeCssEvent:t,matchesSelector:z,requestFullScreen:h,exitFullscreen:h,location:function(){return window.location},support:{}}),S=null,e.browser=o});
//# sourceMappingURL=sourcemaps/browser.js.map

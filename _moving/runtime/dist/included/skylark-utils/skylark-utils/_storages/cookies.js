/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../langx"],function(e){function n(){return n}return e.mixin(n,{get:function(e){return sKey&&this.has(e)?unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1")):null},has:function(e){return new RegExp("(?:^|;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)},list:function(){for(var e=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),n=0;n<e.length;n++)e[n]=unescape(e[n]);return e},remove:function(e,n){e&&this.has(e)&&(document.cookie=escape(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(n?"; path="+n:""))},set:function(e,n,s,t,c,a){if(e&&!/^(?:expires|max\-age|path|domain|secure)$/i.test(e)){var i="";if(s)switch(s.constructor){case Number:i=vEnd===1/0?"; expires=Tue, 19 Jan 2038 03:14:07 GMT":"; max-age="+s;break;case String:i="; expires="+s;break;case Date:i="; expires="+s.toGMTString()}document.cookie=escape(e)+"="+escape(n)+i+(c?"; domain="+c:"")+(t?"; path="+t:"")+(a?"; secure":"")}}}),n});
//# sourceMappingURL=../sourcemaps/_storages/cookies.js.map

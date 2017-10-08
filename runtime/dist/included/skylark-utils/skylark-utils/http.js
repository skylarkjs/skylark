/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.2
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx"],function(t,e){function a(){}function n(t){return t&&(t=t.split(";",2)[0]),t&&("text/html"==t?"html":"application/json"==t?"json":y.test(t)?"script":v.test(t)&&"xml")||"text"}function r(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function s(t){t.processData&&t.data&&!e.isString(t.data)&&(t.data=$.param(t.data,t.traditional)),!t.data||t.type&&"GET"!=t.type.toUpperCase()||(t.url=r(t.url,t.data),t.data=void 0)}function o(t,e,a,n){var r=a.context,s="success";a.success.call(r,t,s,e),p(s,e,a)}function i(t,e,a,n,r){var s=n.context;n.error.call(s,a,e,t),p(e,a,n)}function p(t,e,a){var n=a.context;a.complete.call(n,e,t)}function c(t){var r=e.mixin({},t),p=new x;e.safeMixin(r,T),!r.crossDomain,s(r);var c,l=r.dataType,u=r.accepts[l],m={},d=function(t,e){m[t.toLowerCase()]=[t,e]},y=/^([\w-]+:)\/\//.test(r.url)?RegExp.$1:window.location.protocol,v=r.xhr(),h=v.setRequestHeader;if(r.crossDomain||d("X-Requested-With","XMLHttpRequest"),d("Accept",u||"*/*"),(u=r.mimeType||u)&&(u.indexOf(",")>-1&&(u=u.split(",",2)[0]),v.overrideMimeType&&v.overrideMimeType(u)),(r.contentType||r.contentType!==!1&&r.data&&"GET"!=r.type.toUpperCase())&&d("Content-Type",r.contentType||"application/x-www-form-urlencoded"),r.headers)for(name in r.headers)d(name,r.headers[name]);v.setRequestHeader=d,v.onreadystatechange=function(){if(4==v.readyState){v.onreadystatechange=a,clearTimeout(c);var t,e=!1;if(v.status>=200&&v.status<300||304==v.status||0==v.status&&"file:"==y){l=l||n(r.mimeType||v.getResponseHeader("content-type")),t=v.responseText;try{"script"==l?(0,eval)(t):"xml"==l?t=v.responseXML:"json"==l&&(t=f.test(t)?null:JSON.parse(t))}catch(s){e=s}e?i(e,"parsererror",v,r,p):o(t,v,r,p)}else i(v.statusText||null,v.status?"error":"abort",v,r,p)}};var g=!("async"in r)||r.async;v.open(r.type,r.url,g,r.username,r.password);for(name in m)h.apply(v,m[name]);return r.timeout>0&&(c=setTimeout(function(){v.onreadystatechange=a,v.abort(),i(null,"timeout",v,r,p)},r.timeout)),v.send(r.data?r.data:null),v}function l(){return c(parseArguments.apply(null,arguments))}function u(){var t=parseArguments.apply(null,arguments);return t.type="POST",c(t)}function m(){var t=parseArguments.apply(null,arguments);return t.dataType="json",c(t)}function d(){return d}var x=e.Deferred,f=/^\s*$/,y=/^(?:text|application)\/javascript/i,v=/^(?:text|application)\/xml/i,T={type:"GET",beforeSend:a,success:a,error:a,complete:a,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:"application/json",xml:"application/xml, text/xml",html:"text/html",text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0};return e.mixin(d,{ajax:c,get:l,gtJSON:m,post:u}),t.http=d});
//# sourceMappingURL=sourcemaps/http.js.map

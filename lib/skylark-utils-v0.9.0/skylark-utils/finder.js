/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./browser","./noder"],function(e,r,n,t,i){function s(e,r,n){for(;e=e.parentNode;){if(v(e,r))return e;if(e==n)break}return null}function u(e,r){for(var n=[];(e=e.parentNode)&&(v(e,r)&&n.push(e),e!=n););return n}function a(e,r){return r=r||t.doc(),r.getElementById(e)}function o(e,r){for(var n=e.childNodes,t=[],i=0;i<n.length;i++){var e=n[i];1==e.nodeType&&(r&&!v(e,r)||t.push(e))}return t}function c(e,r){for(;e&&!v(e,r);)e=e.parentNode;return e}function l(e,r){try{return E.call(e.querySelectorAll(r))}catch(n){}return w.query(e,r)}function f(e,r){try{return e.querySelector(r)}catch(n){}var t=w.query(e,r);return t.length>0?t[0]:null}function p(e){return f(document.body,e)}function d(e){return l(document.body,e)}function h(e,r,n){for(var t=e.childNodes,i=t[0];i;){if(1==i.nodeType){if(!r||v(i,r))return i;if(n)break}i=i.nextSibling}return null}function b(e,r,n){for(var t=e.childNodes,i=t[t.length-1];i;){if(1==i.nodeType){if(!r||v(i,r))return i;if(n)break}i=i.previousSibling}return null}function v(e,n){if(!n||!e||1!==e.nodeType)return!1;if(r.isString(n)){try{return A.call(e,n.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g,'[$1="$2"]'))}catch(t){}return w.match(e,n)}return w.check(e,n)}function g(e,r,n){for(var t=e.nextSibling;t;){if(1==t.nodeType){if(!r||v(t,r))return t;if(n)break}t=t.nextSibling}return null}function k(e,r){for(var n=e.nextSibling,t=[];n;)1==n.nodeType&&(r&&!v(n,r)||t.push(n)),n=n.nextSibling;return t}function y(e,r){var n=e.parentNode;return!n||r&&!v(n,r)?null:n}function x(e,r,n){for(var t=e.previousSibling;t;){if(1==t.nodeType){if(!r||v(t,r))return t;if(n)break}t=t.previousSibling}return null}function S(e,r){for(var n=e.previousSibling,t=[];n;)1==n.nodeType&&(r&&!v(n,r)||t.push(n)),n=n.previousSibling;return t}function m(e,r){for(var n=e.parentNode.firstChild,t=[];n;)1==n.nodeType&&n!==e&&(r&&!v(n,r)||t.push(n)),n=n.nextSibling;return t}var w={},N=Array.prototype.filter,E=Array.prototype.slice,A=n.matchesSelector;(function(){function e(e,s,u,o,l,p,d,h,b,v,g,k,y,x,S,m){if((s||n===-1)&&(r.expressions[++n]=[],t=-1,s))return"";if(u||o||t===-1){u=u||" ";var w=r.expressions[n];i&&w[t]&&(w[t].reverseCombinator=c(u)),w[++t]={combinator:u,tag:"*"}}var N=r.expressions[n][t];if(l)N.tag=l.replace(a,"");else if(p)N.id=p.replace(a,"");else if(d)d=d.replace(a,""),N.classList||(N.classList=[]),N.classes||(N.classes=[]),N.classList.push(d),N.classes.push({value:d,regexp:new RegExp("(^|\\s)"+f(d)+"(\\s|$)")});else if(y)m=m||S,m=m?m.replace(a,""):null,N.pseudos||(N.pseudos=[]),N.pseudos.push({key:y.replace(a,""),value:m,type:1==k.length?"class":"element"});else if(h){h=h.replace(a,""),g=(g||"").replace(a,"");var $,E;switch(b){case"^=":E=new RegExp("^"+f(g));break;case"$=":E=new RegExp(f(g)+"$");break;case"~=":E=new RegExp("(^|\\s)"+f(g)+"(\\s|$)");break;case"|=":E=new RegExp("^"+f(g)+"(-|$)");break;case"=":$=function(e){return g==e};break;case"*=":$=function(e){return e&&e.indexOf(g)>-1};break;case"!=":$=function(e){return g!=e};break;default:$=function(e){return!!e}}""==g&&/^[*$^]=$/.test(b)&&($=function(){return!1}),$||($=function(e){return e&&E.test(e)}),N.attributes||(N.attributes=[]),N.attributes.push({key:h,operator:b,value:g,test:$})}return""}var r,n,t,i,s={},u={},a=/\\/g,o=function(t,a){if(null==t)return null;if(t.Slick===!0)return t;t=(""+t).replace(/^\s+|\s+$/g,""),i=!!a;var c=i?u:s;if(c[t])return c[t];for(r={Slick:!0,expressions:[],raw:t,reverse:function(){return o(this.raw,!0)}},n=-1;t!=(t=t.replace(p,e)););return r.length=r.expressions.length,c[r.raw]=i?l(r):r},c=function(e){return"!"===e?" ":" "===e?"!":/^!/.test(e)?e.replace(/^!/,""):"!"+e},l=function(e){for(var r=e.expressions,n=0;n<r.length;n++){for(var t=r[n],i={parts:[],tag:"*",combinator:c(t[0].combinator)},s=0;s<t.length;s++){var u=t[s];u.reverseCombinator||(u.reverseCombinator=" "),u.combinator=u.reverseCombinator,delete u.reverseCombinator}t.reverse().push(i)}return e},f=function(){var e=/(?=[\-\[\]{}()*+?.\\\^$|,#\s])/g,r="\\";return function(n){return n.replace(e,r)}}(),p=new RegExp("^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)".replace(/<combinator>/,"["+f(">+~`!@$%^&={}\\;</")+"]").replace(/<unicode>/g,"(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])").replace(/<unicode1>/g,"(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])")),d=this.Slick||{};d.parse=function(e){return o(e)},d.escapeRegExp=f,this.Slick||(this.Slick=d)}).apply(w);var E=Array.prototype.slice;w.parseSelector=w.Slick.parse,w.pseudos={checked:function(e){return!!e.checked},contains:function(e,r,n,t){if($(this).text().indexOf(t)>-1)return this},disabled:function(e){return!!e.disabled},enabled:function(e){return!e.disabled},eq:function(e,r,n,t){return r===t},focus:function(e){return document.activeElement===e&&(e.href||e.type||e.tabindex)},first:function(e,r){return 0===r},has:function(e,r,n,t){return w.querySelector(e,t).length>0},hidden:function(e){return!w.pseudos.visible(e)},last:function(e,r,n){return r===n.length-1},parent:function(e){return!!e.parentNode},selected:function(e){return!!e.selected},visible:function(e){return e.offsetWidth&&e.offsetWidth}},w.divide=function(e){var r,n,t,i,s,u="",a=[];if((n=e.id)&&(u+="#"+n),t=e.classes)for(var o=t.length;o--;)u+="."+t[o].value;if(i=e.attributes)for(var o=0;o<i.length;o++)u+=i[o].Operator?"["+i[o].key+i[o].Operator+JSON.stringify(i[o].value)+NaN:"["+i[o].key+"]";if(s=e.pseudos)for(o=s.length;o--;)part=s[o],this.pseudos[part.key]?a.push(part):part.value!==undefine&&(u+=":"+part.key+"("+JSON.stringify(part));return(r=e.tag)&&(u=r.toUpperCase()+u),u||(u="*"),{nativeSelector:u,customPseudos:a}},w.check=function(e,r,n,t){var i,s,u,a,o;if(i=r.tag){var c=e.nodeName.toUpperCase();if("*"==i){if(c<"@")return!1}else if(c!=i)return!1}if((s=r.id)&&e.getAttribute("id")!=s)return!1;var l,f,p,d;if(u=r.classes)for(l=u.length;l--;)if(p=e.getAttribute("class"),!p||!u[l].regexp.test(p))return!1;if(a)for(l=a.length;l--;)if(f=a[l],f.operator?!f.test(e.getAttribute(f.key)):!e.hasAttribute(f.key))return!1;if(o=r.pseudos)for(l=o.length;l--;)if(f=o[l],d=this.pseudos[f.key]){if(!d(e,n,t,f.value))return!1}else if(!A.call(e,f.key))return!1;return!0},w.match=function(e,r){var n=w.Slick.parse(r);if(!n)return!0;var t,i=n.expressions,s=0;for(t=0;currentExpression=i[t];t++)if(1==currentExpression.length){var u=currentExpression[0];if(this.check(e,u))return!0;s++}if(s==n.length)return!1;var a,o=this.query(document,n);for(t=0;a=o[t++];)if(a===e)return!0;return!1},w.combine=function(e,r){var n,t=r.combinator,i=r,s=[];switch(t){case">":s=o(e,i);break;case"+":n=g(e,i,!0),n&&s.push(n);break;case"^":n=h(e,i,!0),n&&s.push(n);break;case"~":s=k(e,i);break;case"++":var a=x(e,i,!0),c=g(e,i,!0);a&&s.push(a),c&&s.push(c);break;case"~~":s=m(e,i);break;case"!":s=u(e,i);break;case"!>":n=y(e,i),n&&s.push(n);break;case"!+":s=x(e,i,!0);break;case"!^":n=b(e,i,!0),n&&s.push(n);break;case"!~":s=S(e,i);break;default:var l=this.divide(r);if(s=E.call(e.querySelectorAll(l.nativeSelector)),l.customPseudos)for(var f=l.customPseudos.length-1;f>=0;f--)s=N.call(s,function(e,r){return w.check(e,{pseudos:[l.customPseudos[f]]},r,s)})}return s},w.query=function(e,n,t){for(var i,s,u=this.Slick.parse(n),a=[],o=u.expressions,c=0;i=o[c];c++){for(var l,f=[e],p=0;s=i[p];p++)l=r.map(f,function(e,r){return w.combine(e,s)}),l&&(f=l);l&&(a=a.concat(l))}return a};var C=function(){return C};return r.mixin(C,{ancestor:s,ancestors:u,byId:a,children:o,closest:c,descendant:f,descendants:l,find:p,findAll:d,firstChild:h,lastChild:b,matches:v,nextSibling:g,nextSiblings:k,parent:y,previousSibling:x,previousSiblings:S,pseudos:w.pseudos,siblings:m}),e.finder=C});
//# sourceMappingURL=sourcemaps/finder.js.map
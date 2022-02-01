/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./noder","./datax","./eventer","./finder","./geom","./styler","./fx"],function(t,n,e,i,r,o,a,s,c){function l(t,n){return function(){var e=this,i=w.call(arguments),r=$.map(e,function(e,r){return t.apply(n,[e].concat(i))});return $(N(r))}}function f(t,n,e){return function(i){var r=(w.call(arguments),this.map(function(r,o){if(o.querySelector)return t.apply(n,e?[o]:[o,i])}));return e&&i?r.filter(i):r}}function u(t,n,e){return function(i,r){w.call(arguments);void 0===r&&(r=i,i=void 0);var o=this.map(function(o,a){if(a.querySelector)return t.apply(n,e?[a,i]:[a,r,i])});return e&&r?o.filter(r):o}}function h(t,n){return function(){var e=this,i=w.call(arguments);return this.each(function(e){t.apply(n,[this].concat(i))}),e}}function p(t,n,e){return function(i){var r=this,o=w.call(arguments);return k.call(r,function(r,a){C(r,i,a,e(r));t.apply(n,[r,i].concat(o.slice(1)))}),r}}function d(t,n){return function(){var e=this,i=w.call(arguments);return m.call(e,function(e){return t.apply(n,[e].concat(i))})}}function v(t,e,i){return function(r,o){var a=this,s=w.call(arguments);return n.isPlainObject(r)||n.isDefined(o)?(k.call(a,function(n,a){var c;c=i?C(n,o,a,i(n,r)):o,t.apply(e,[n].concat(s))}),a):a[0]?t.apply(e,[a[0],r]):void 0}}function g(t,e,i){return function(r){var o=this;return n.isDefined(r)?(k.call(o,function(n,o){var a;a=i?C(n,r,o,i(n)):r,t.apply(e,[n,a])}),o):o[0]?t.apply(e,[o[0]]):void 0}}var y,m=Array.prototype.some,b=Array.prototype.push,w=(Array.prototype.every,Array.prototype.concat,Array.prototype.slice),A=(Array.prototype.map,Array.prototype.filter),k=Array.prototype.forEach,x=Array.prototype.indexOf,O=Array.prototype.sort,S=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,C=n.funcArg,j=n.isArrayLike,z=n.isString,N=n.uniq,T=n.isFunction,E=n.type,P=n.isArray,q=(n.isWindow,n.isDocument,n.isObject),W=(n.isPlainObject,n.compact,n.flatten,n.camelCase,n.dasherize,o.children,n.klass({klassName:"SkNodeList",init:function(t,i){var r,a,s,c,l=this;if(t&&(l.context=i=i||e.doc(),z(t)?(l.selector=t,r="<"===t.charAt(0)&&">"===t.charAt(t.length-1)&&t.length>=3?[null,t,null]:S.exec(t),r?r[1]?(a=e.createFragment(t),n.isPlainObject(i)&&(c=i)):(s=o.byId(r[2],e.ownerDoc(i)),s&&(a=[s])):(n.isString(i)&&(i=o.find(i)),a=o.descendants(i,t))):a=P(t)?t:[t]),a&&(b.apply(l,a),c))for(var f in c)n.isFunction(this[f])?this[f](c[f]):this.attr(f,c[f]);return l}})),D=function(){function t(t,i,r){return function(r){var o,a=n.map(arguments,function(t){return o=E(t),"object"==o||"array"==o||null==t?t:e.createFragment(t)});return a.length<1?this:(this.each(function(n){t.apply(i,[this,a,n>0])}),this)}}y=function(t){return t instanceof W},init=function(t,n){return new W(t,n)};var S=function(t,n){return T(t)?void r.ready(function(){t(S)}):y(t)?t:n&&y(n)&&z(t)?n.find(t):init(t,n)};S.fn=W.prototype,n.mixin(S.fn,{length:0,map:function(t){return S(N(n.map(this,function(n,e){return t.call(n,e,n)})))},slice:function(){return S(w.apply(this,arguments))},forEach:function(){return k.apply(this,arguments)},get:function(t){return void 0===t?w.call(this):this[t>=0?t:t+this.length]},indexOf:function(){return x.apply(this,arguments)},sort:function(){return O.apply(this,arguments)},toArray:function(){return w.call(this)},size:function(){return this.length},remove:h(e.remove,e),each:function(t){return n.each(this,t),this},filter:function(t){return T(t)?this.not(this.not(t)):S(A.call(this,function(n){return o.matches(n,t)}))},add:function(t,n){return S(N(this.toArray().concat(S(t,n).toArray())))},is:function(t){if(this.length>0){var e=this;if(n.isString(t))return m.call(e,function(n){return o.matches(n,t)});if(n.isArrayLike(t))return m.call(e,function(e){return n.inArray(e,t)>-1});if(n.isHtmlNode(t))return m.call(e,function(n){return n==t})}return!1},not:function(t){var n=[];if(T(t)&&void 0!==t.call)this.each(function(e){t.call(this,e)||n.push(this)});else{var e="string"==typeof t?this.filter(t):j(t)&&T(t.item)?w.call(t):S(t);this.forEach(function(t){e.indexOf(t)<0&&n.push(t)})}return S(n)},has:function(t){return this.filter(function(){return q(t)?e.contains(this,t):S(this).find(t).size()})},eq:function(t){return t===-1?this.slice(t):this.slice(t,+t+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},find:f(o.descendants,o),closest:f(o.closest,o),parents:f(o.ancestors,o),parentsUntil:u(o.ancestors,o),parent:f(o.parent,o),children:f(o.children,o),contents:l(e.contents,e),empty:h(e.empty,e),pluck:function(t){return n.map(this,function(n){return n[t]})},pushStack:function(t){var n=S(t);return n.prevObject=this,n},show:h(c.show,c),replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var n=T(t);if(this[0]&&!n)var e=S(t).get(0),i=e.parentNode||this.length>1;return this.each(function(r){S(this).wrapAll(n?t.call(this,r):i?e.cloneNode(!0):e)})},wrapAll:function(t){if(this[0]){S(this[0]).before(t=S(t));for(var n;(n=t.children()).length;)t=n.first();S(t).append(this)}return this},wrapInner:function(t){var n=T(t);return this.each(function(e){var i=S(this),r=i.contents(),o=n?t.call(this,e):t;r.length?r.wrapAll(o):i.append(o)})},unwrap:function(t){return 0===this.parent().children().length?this.parent(t).not("body").each(function(){S(this).replaceWith(document.createTextNode(this.childNodes[0].textContent))}):this.parent().each(function(){S(this).replaceWith(S(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:h(c.hide,c),toggle:function(t){return this.each(function(){var n=S(this);(void 0===t?"none"==n.css("display"):t)?n.show():n.hide()})},prev:function(t){return S(this.pluck("previousElementSibling")).filter(t||"*")},prevAll:f(o.previousSibling,o),next:function(t){return S(this.pluck("nextElementSibling")).filter(t||"*")},nextAll:f(o.nextSiblings,o),siblings:f(o.siblings,o),html:g(e.html,e,e.html),text:g(i.text,i,i.text),attr:v(i.attr,i,i.attr),removeAttr:h(i.removeAttr,i),prop:v(i.prop,i,i.prop),removeProp:h(i.removeProp,i),data:v(i.data,i,i.data),removeData:h(i.removeData,i),val:g(i.val,i,i.val),offset:g(a.pagePosition,a,a.pagePosition),style:v(s.css,s),css:v(s.css,s),index:function(t){return t?this.indexOf(S(t)[0]):this.parent().children().indexOf(this[0])},hasClass:d(s.hasClass,s),addClass:p(s.addClass,s,s.className),removeClass:p(s.removeClass,s,s.className),toggleClass:p(s.toggleClass,s,s.className),scrollTop:g(a.scrollTop,a),scrollLeft:g(a.scrollLeft,a),position:function(){if(this.length){var t=this[0];return a.relativePosition(t)}},offsetParent:l(a.offsetParent,a)}),S.fn.detach=S.fn.remove,S.fn.hover=function(t,n){return this.mouseenter(t).mouseleave(n||t)},S.fn.size=g(a.size,a),S.fn.width=g(a.width,a,a.width),S.fn.height=g(a.height,a,a.height),S.fn.clientSize=g(a.clientSize,a.clientSize),["width","height"].forEach(function(t){var n=t.replace(/./,function(t){return t[0].toUpperCase()});S.fn["outer"+n]=function(n,e){if(arguments.length?"boolean"!=typeof n&&(e=n,n=!1):(n=!1,e=void 0),void 0===e){var i=this[0];if(!i)return;var r=a.size(i);if(n){var o=a.marginExtents(i);r.width=r.width+o.left+o.right,r.height=r.height+o.top+o.bottom}return"width"===t?r.width:r.height}return this.each(function(i,r){var o={},s=a.marginExtents(r);"width"===t?(o.width=e,n&&(o.width=o.width-s.left-s.right)):(o.height=e,n&&(o.height=o.height-s.top-s.bottom)),a.size(r,o)})}}),S.fn.innerWidth=g(a.clientWidth,a,a.clientWidth),S.fn.innerHeight=g(a.clientHeight,a,a.clientHeight);e.traverse;return S.fn.after=t(e.after,e),S.fn.prepend=t(e.prepend,e),S.fn.before=t(e.before,e),S.fn.append=t(e.append,e),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(t,n){S.fn[t]=function(t){for(var e,i=[],r=S(t),o=r.length-1,a=0;a<=o;a++)e=a===o?this:this.clone(!0),S(r[a])[n](e),b.apply(i,e.get());return this.pushStack(i)}}),S}();return function(t){t.fn.on=h(r.on,r),t.fn.off=h(r.off,r),t.fn.trigger=h(r.trigger,r),"focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(n){t.fn[n]=function(t,e){return 0 in arguments?this.on(n,t,e):this.trigger(n)}}),t.fn.one=function(t,e,i,r){return n.isString(e)||n.isFunction(r)||(r=i,i=e,e=null),n.isFunction(i)&&(r=i,i=null),this.on(t,e,i,r,1)},t.fn.animate=h(c.animate,c),t.fn.show=h(c.show,c),t.fn.hide=h(c.hide,c),t.fn.toogle=h(c.toogle,c),t.fn.fadeTo=h(c.fadeTo,c),t.fn.fadeIn=h(c.fadeIn,c),t.fn.fadeOut=h(c.fadeOut,c),t.fn.fadeToggle=h(c.fadeToggle,c),t.fn.slideDown=h(c.slideDown,c),t.fn.slideToggle=h(c.slideToggle,c),t.fn.slideUp=h(c.slideUp,c)}(D),function(t){t.fn.end=function(){return this.prevObject||t()},t.fn.andSelf=function(){return this.add(this.prevObject||t())},t.fn.addBack=function(t){return this.prevObject?t?this.add(this.prevObject.filter(t)):this.add(this.prevObject):this},"filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings".split(",").forEach(function(n){var e=t.fn[n];t.fn[n]=function(){var t=e.apply(this,arguments);return t.prevObject=this,t}})}(D),function(t){t.fn.query=t.fn.find,t.fn.place=function(t,i){return n.isString(t)?t=o.descendant(t):y(t)&&(t=t[0]),this.each(function(n,r){switch(i){case"before":e.before(t,r);break;case"after":e.after(t,r);break;case"replace":e.replace(t,r);break;case"only":e.empty(t),e.append(t,r);break;case"first":e.prepend(t,r);break;default:e.append(t,r)}})},t.fn.addContent=function(t,e){return t.template&&(t=n.substitute(t.template,t)),this.append(t)},t.fn.replaceClass=function(t,n){return this.removeClass(n),this.addClass(t),this}}(D),t.query=D});
//# sourceMappingURL=sourcemaps/query.js.map
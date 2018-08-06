/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./noder","./styler"],function(t,i,e,o){function n(){if(void 0!==B)return B;var t,i,n=e.createFragment("<div style='display:block;position:absolute;width:200px;height:200px;overflow:hidden;'><div style='height:300px;width:auto;'></div></div>")[0],h=n.childNodes[0];return e.append(document.body,n),t=h.offsetWidth,o.css(n,"overflow","scroll"),i=h.offsetWidth,t===i&&(i=n[0].clientWidth),e.remove(n),B=t-i}function h(t){var i=getComputedStyle(t);return{left:P(i.borderLeftWidth,t),top:P(i.borderTopWidth,t),right:P(i.borderRightWidth,t),bottom:P(i.borderBottomWidth,t)}}function r(t,i){if(void 0===i)return C.test(t.nodeName)?{top:0,left:0}:t.getBoundingClientRect();var e=O(t),o=r(e),n=p(t),d=h(e);return b(t,{top:i.top-o.top-n.top-d.top,left:i.left-o.left-n.left-d.left}),this}function d(t,i){return void 0===i?t.getBoundingClientRect():(r(t,i),H(t,i),this)}function f(t,i){return void 0==i?l(t).height:l(t,{height:i})}function l(t,i){if(void 0==i)return{width:t.clientWidth,height:t.clientHeight};var e="border-box"===o.css(t,"box-sizing"),n={width:i.width,height:i.height};if(e){var r=h(t);void 0!==n.width&&(n.width=n.width+r.left+r.right),void 0!==n.height&&(n.height=n.height+r.top+r.bottom)}else{var d=v(t);void 0!==n.width&&(n.width=n.width-d.left-d.right),void 0!==n.height&&(n.height=n.height-d.top-d.bottom)}return o.css(t,n),this}function g(t,i){return void 0==i?l(t).width:(l(t,{width:i}),this)}function s(t){var i=l(t),e=v(t);return{left:e.left,top:e.top,width:i.width-e.left-e.right,height:i.height-e.top-e.bottom}}function c(t){var i=t.documentElement,e=t.body,o=Math.max,n=o(i.scrollWidth,e.scrollWidth),h=o(i.clientWidth,e.clientWidth),r=o(i.offsetWidth,e.offsetWidth),d=o(i.scrollHeight,e.scrollHeight),f=o(i.clientHeight,e.clientHeight),l=o(i.offsetHeight,e.offsetHeight);return{width:n<r?h:n,height:d<l?f:d}}function u(t,i){return void 0==i?H(t).height:(H(t,{height:i}),this)}function p(t){var i=getComputedStyle(t);return{left:P(i.marginLeft),top:P(i.marginTop),right:P(i.marginRight),bottom:P(i.marginBottom)}}function a(t){var i=this.relativeRect(t),e=this.marginExtents(t);return{left:i.left,top:i.top,width:i.width+e.left+e.right,height:i.height+e.top+e.bottom}}function v(t){var i=getComputedStyle(t);return{left:P(i.paddingLeft),top:P(i.paddingTop),right:P(i.paddingRight),bottom:P(i.paddingBottom)}}function w(t,i){if(void 0===i){var e=t.getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset}}var o=O(t),n=w(o),r=p(t),d=h(o);return b(t,{top:i.top-n.top-r.top-d.top,left:i.left-n.left-r.left-d.left}),this}function m(t,i){if(void 0===i){var e=t.getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}}return w(t,i),H(t,i),this}function b(t,i){if(void 0==i){var e=O(t),n=r(t),d=r(e),f=(p(t),h(e));return{top:n.top-d.top-f.top,left:n.left-d.left-f.left}}var l={top:i.top,left:i.left};return"static"==o.css(t,"position")&&(l.position="relative"),o.css(t,l),this}function W(t,i){if(void 0===i){var e=O(t),o=d(t),n=r(e),f=(p(t),h(e));return{top:o.top-n.top-f.top,left:o.left-n.left-f.left,width:o.width,height:o.height}}return b(t,i),H(t,i),this}function x(t,i){function e(t,i){var e,o,n=t;for(e=o=0;n&&n!=i&&n.nodeType;)e+=n.offsetLeft||0,o+=n.offsetTop||0,n=n.offsetParent;return{x:e,y:o}}var o,n,h,r,d,f,l=t.parentNode,g=e(t,l);return o=g.x,n=g.y,h=t.offsetWidth,r=t.offsetHeight,d=l.clientWidth,f=l.clientHeight,"end"==i?(o-=d-h,n-=f-r):"center"==i&&(o-=d/2-h/2,n-=f/2-r/2),l.scrollLeft=o,l.scrollTop=n,this}function y(t,i){var e="scrollLeft"in t;return void 0===i?e?t.scrollLeft:t.pageXOffset:(e?t.scrollLeft=i:t.scrollTo(i,t.scrollY),this)}function R(t,i){var e="scrollTop"in t;return void 0===i?e?t.scrollTop:t.pageYOffset:(e?t.scrollTop=i:t.scrollTo(t.scrollX,i),this)}function H(t,e){if(void 0==e)return i.isWindow(t)?{width:t.innerWidth,height:t.innerHeight}:i.isDocument(t)?c(document):{width:t.offsetWidth,height:t.offsetHeight};var n="border-box"===o.css(t,"box-sizing"),r={width:e.width,height:e.height};if(!n){var d=v(t),f=h(t);void 0!==r.width&&""!==r.width&&null!==r.width&&(r.width=r.width-d.left-d.right-f.left-f.right),void 0!==r.height&&""!==r.height&&null!==r.height&&(r.height=r.height-d.top-d.bottom-f.top-f.bottom)}return o.css(t,r),this}function T(t,i){return void 0==i?H(t).width:(H(t,{width:i}),this)}function L(){return L}var B,C=/^(?:body|html)$/i,P=i.toPixel,O=e.offsetParent;return i.mixin(L,{borderExtents:h,boundingPosition:r,boundingRect:d,clientHeight:f,clientSize:l,clientWidth:g,contentRect:s,getDocumentSize:c,height:u,marginExtents:p,marginRect:a,offsetParent:O,paddingExtents:v,pagePosition:w,pageRect:m,relativePosition:b,relativeRect:W,scrollbarWidth:n,scrollIntoView:x,scrollLeft:y,scrollTop:R,size:H,width:T}),t.geom=L});
//# sourceMappingURL=sourcemaps/geom.js.map

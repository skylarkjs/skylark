/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./eventer"],function(e,n,t){function r(e){function n(e){for(var n=e.length;n--;)e[n].size>a&&e.splice(n,1);o(e)}if(o=e,!i){var t=i=document.createElement("input");t.type="file",t.style.position="fixed",t.style.left=0,t.style.top=0,t.style.opacity=.001,document.body.appendChild(t),t.onchange=function(e){n(Array.prototype.slice.call(e.target.files)),t.value=""}}t.click()}var i,o,c=t.on,a=(t.attr,1/0),l=function(){return l};return n.mixin(l,{picker:function(e,n){n=n||{};var t=n.picked;return c(e,"click",function(e){e.preventDefault(),r(t)}),this},dropzone:function(e,n){n=n||{};var t=n.dropped;return c(e,"dragover,dragend",function(e){return!1}),c(e,"drop",function(e){e.preventDefault(),t&&t(e.dataTransfer.files)}),this}}),e.filer=l});
//# sourceMappingURL=sourcemaps/filer.js.map

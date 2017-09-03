/**
 * skylark - An Elegant JavaScript Library and HTML5 Application Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark/skylark","skylark/langx","skylark/eventer"],function(e,n,t){function r(e){function n(e){for(var n=e.length;n--;)e[n].size>l&&e.splice(n,1);o(e)}if(o=e,!i){var t=i=document.createElement("input");t.type="file",t.style.position="fixed",t.style.left=0,t.style.top=0,t.style.opacity=.001,document.body.appendChild(t),t.onchange=function(e){n(Array.prototype.slice.call(e.target.files)),t.value=""}}t.click()}var i,o,a=t.on,l=(t.attr,1/0),c=function(){return c};return n.mixin(c,{picker:function(e,n){n=n||{};var t=n.picked;return a(e,"click",function(e){e.preventDefault(),r(t)}),this},dropzone:function(e,n){n=n||{};var t=n.dropped;return a(e,"dragover,dragend",function(e){return!1}),a(e,"drop",function(e){e.preventDefault(),t&&t(e.dataTransfer.files)}),this}}),e.filer=c});
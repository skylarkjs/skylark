/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./noder","./datax","./geom","./eventer","./styler"],function(e,t,n,o,i,r,a){function u(e,t){function o(e){var t,n;if(e.changedTouches)for(t="screenX screenY pageX pageY clientX clientY".split(" "),n=0;n<t.length;n++)e[t[n]]=e.changedTouches[0][t[n]]}t=t||{};var u,c,s,m,d,f,l,v,h=t.handle||e,p=t.constraints,g=t.document||document,X=t.started,Y=t.moving,x=t.stopped,s=function(t){var s,p=i.getDocumentSize(g);o(t),t.preventDefault(),c=t.button,d=t.screenX,f=t.screenY,l=i.relativePosition(e),v=i.size(e),s=a.css(h,"curosr"),u=n.createElement("div"),a.css(u,{position:"absolute",top:0,left:0,width:p.width,height:p.height,zIndex:2147483647,opacity:1e-4,cursor:s}),n.append(g.body,u),r.on(g,"mousemove touchmove",b).on(g,"mouseup touchend",m),X&&X(t)},b=function(t){if(o(t),0!==t.button)return m(t);t.deltaX=t.screenX-d,t.deltaY=t.screenY-f;var n=l.left+t.deltaX,r=l.top+t.deltaY;p&&(n<p.minX&&(n=p.minX),n>p.maxX&&(n=p.maxX),r<p.minY&&(r=p.minY),r>p.maxY&&(r=p.maxY)),i.relativePosition(e,{left:n,top:r}),t.preventDefault(),Y&&Y(t)},m=function(e){o(e),r.off(g,"mousemove touchmove",b).off(g,"mouseup touchend",m),n.remove(u),x&&x(e)};return r.on(h,"mousedown touchstart",s),{remove:function(){r.off(h)}}}function c(){return c}r.on,r.off,o.attr,o.removeAttr,i.pagePosition,a.addClass,i.height;return t.mixin(c,{movable:u}),e.mover=c});
//# sourceMappingURL=sourcemaps/mover.js.map

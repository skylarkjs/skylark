/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./noder","./datax","./geom","./eventer","./mover","./styler","./query"],function(t,e,r,i,n,o,a,c,s){function l(t){t=t||{},A=t.classPrefix||"";var e=t.appendTo||document.body;m=r.createElement("div",{"class":A+"resizer-c"}),r.append(e,m),v={},["tl","tc","tr","cl","cr","bl","bc","br"].forEach(function(t){return v[t]=r.createElement("i",{"class":A+"resizer-h "+A+"resizer-h-"+t,"data-resize-handler":t})});for(var i in v){var n=v[i];r.append(m,n),a.movable(n,{auto:!1,started:d,moving:h,stopped:p})}}function d(t){t.target;b=n.size(y),w&&w(t)}function h(t){z={},E.left||E.right?z.width=b.width+t.deltaX:z.width=b.width,E.top||E.bottom?z.height=b.height+t.deltaY:z.height=b.height,n.size(y,z),n.pageRect(m,n.pageRect(y)),x&&x(t)}function p(t){R&&R(t)}function u(t,e){t&&t===y||(y=t,startDim=rectDim=startPos=null,n.pageRect(m,n.pageRect(y)),c.show(m))}function f(t){m&&c.hide(m),y=null}function g(){return g}var m,v,y,b,z,w,x,R,A=(o.on,o.off,i.attr,i.removeAttr,n.pagePosition,c.addClass,n.height,Array.prototype.some,Array.prototype.map,""),E={left:!0,right:!0,top:!0,bottom:!0};return e.mixin(g,{init:l,select:u,unselect:f}),t.selector=g});
//# sourceMappingURL=sourcemaps/selector.js.map

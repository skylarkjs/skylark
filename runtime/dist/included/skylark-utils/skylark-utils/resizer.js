/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./noder","./datax","./finder","./geom","./eventer","./mover","./styler","./query"],function(t,e,i,o,r,n,a,d,h,s){function f(t,i){var o={touchActionNone:!0,direction:{top:!1,left:!1,right:!0,bottom:!0},handle:{border:!0,grabber:"",selector:!0}};i=i||{};var h,s,f,c=i.handle||{},l=i.direction||o.direction,u=i.started,g=i.moving,m=i.stopped;return e.isString(c)?h=r.find(t,c):e.isHtmlNode(c)&&(h=c),d.movable(h,{auto:!1,started:function(e){s=n.size(t),u&&u(e)},moving:function(e){f={},l.left||l.right?f.width=s.width+e.deltaX:f.width=s.width,l.top||l.bottom?f.height=s.height+e.deltaY:f.height=s.height,n.size(t,f),g&&g(e)},stopped:function(t){m&&m(t)}}),{remove:function(){a.off(h)}}}function c(){return c}a.on,a.off,o.attr,o.removeAttr,n.pagePosition,h.addClass,n.height,Array.prototype.some,Array.prototype.map;return s.fn.resizable=function(t){this.each(function(e){f(this,t)})},e.mixin(c,{resizable:f}),t.resizer=c});
//# sourceMappingURL=sourcemaps/resizer.js.map

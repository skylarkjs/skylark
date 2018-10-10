/**
 * skylark-langx - A simple JavaScript language extension library, including class support, Evented class, Deferred class and some commonly used tool functions.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./Deferred","./arrays"],function(n,e){var r=e.each,u={parallel:function(e,u,l){var t=[];return l=l||null,u=u||[],r(e,function(n,e){t.push(e.apply(l,u))}),n.all(t)},series:function(e,u,l){var t=[],a=new n,i=a.promise;return l=l||null,u=u||[],a.resolve(),r(e,function(n,e){i=i.then(function(){return e.apply(l,u)}),t.push(i)}),n.all(t)},waterful:function(e,u,l){var t=new n,a=t.promise;return l=l||null,u=u||[],t.resolveWith(l,u),r(e,function(n,e){a=a.then(e)}),a}};return u});
//# sourceMappingURL=sourcemaps/async.js.map

/**
 * skylark-utils - An Elegant HTML5 JavaScript Library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./skylark","./langx","./browser","./geom","./styler","./eventer"],function(i,t,n,o,s,e){function a(i,n,a,r,c,p){var d,g,m,u={},f=[],h="",v=this,w=!1,F=!1,S=!1;if(t.isPlainObject(a)&&(r=a.easing,c=a.complete,p=a.delay,a=a.duration),t.isString(a)&&(a=y.speeds[a]),void 0===a&&(a=y.speeds.normal),a/=1e3,y.off&&(a=0),t.isFunction(r)?(c=r,eace="swing"):r=r||"swing",p?p/=1e3:p=0,t.isString(n))u[b]=n,u[T]=a+"s",u[P]=r,g=I;else{for(d in n){var X=n[d];if(k.test(d))h+=d+"("+X+") ";else{if("scrollTop"===d&&(F=!0),"clip"==d&&t.isPlainObject(X)){if(u[d]="rect("+X.top+"px,"+X.right+"px,"+X.bottom+"px,"+X.left+"px)","auto"==s.css(i,"clip")){var Y=o.size(i);s.css(i,"clip","rect(0px,"+Y.width+"px,"+Y.height+"px,0px)"),S=!0}}else u[d]=X;f.push(t.dasherize(d))}}g=j}return h&&(u[O]=h,f.push(O)),a>0&&t.isPlainObject(n)&&(u[x]=f.join(", "),u[z]=a+"s",u[C]=p+"s",u[B]=r),m=function(t){if(w=!0,t){if(t.target!==t.currentTarget)return;e.off(t.target,g,m)}else e.off(i,I,m);s.css(i,E),c&&c.call(this)},a>0&&(e.on(i,g,m),t.debounce(function(){w||m.call(v)},1e3*(a+p)+25)()),i.clientLeft,s.css(i,u),a<=0&&t.debounce(function(){w||m.call(v)},0)(),F&&l(i,n.scrollTop,a,c),this}function r(i,n,o){return s.show(i),n&&(!o&&t.isFunction(n)&&(o=n,n="normal"),s.css(i,"opacity",0),a(i,{opacity:1,scale:"1,1"},n,o)),this}function c(i,n,o){return n?(!o&&t.isFunction(n)&&(o=n,n="normal"),a(i,{opacity:0,scale:"0,0"},n,function(){s.hide(i),o&&o.call(i)})):s.hide(i),this}function l(i,n,o,s){var e=parseInt(i.scrollTop),a=0,r=5,c=1e3*o/r,l=parseInt(n),p=setInterval(function(){a++,a<=c&&(i.scrollTop=(l-e)/c*a+e),a>=c+1&&(clearInterval(p),s&&t.debounce(s,1e3)())},r)}function p(i,t,n){return s.isInvisible(i)?r(i,t,n):c(i,t,n),this}function d(i,t,n,o,s){return a(i,{opacity:n},t,o,s),this}function g(i,t,n,o){var e=s.css(i,"opacity");return e>0?s.css(i,"opacity",0):e=1,s.show(i),d(i,t,e,n,o),this}function m(i,n,o,e){var a,r=s.css(i,"opacity"),c={};return t.isPlainObject(n)?(c.easing=n.easing,c.duration=n.duration,a=n.complete):(c.duration=n,e?(a=e,c.easing=o):a=o),c.complete=function(){s.css(i,"opacity",r),s.hide(i),a&&a.call(i)},d(i,c,0),this}function u(i,t,n,o){return s.isInvisible(i)?g(i,t,easing,callback):m(i,t,easing,callback),this}function f(i,t,n){var o=s.css(i,"position");r(i),s.css(i,{position:"absolute",visibility:"hidden"});var e=s.css(i,"margin-top"),c=s.css(i,"margin-bottom"),l=s.css(i,"padding-top"),p=s.css(i,"padding-bottom"),d=s.css(i,"height");return s.css(i,{position:o,visibility:"visible",overflow:"hidden",height:0,marginTop:0,marginBottom:0,paddingTop:0,paddingBottom:0}),a(i,{height:d,marginTop:e,marginBottom:c,paddingTop:l,paddingBottom:p},{duration:t,complete:function(){n&&n.apply(i)}}),this}function h(i,t,n){if(o.height(i)>0){var e=(s.css(i,"position"),s.css(i,"height")),r=s.css(i,"margin-top"),l=s.css(i,"margin-bottom"),p=s.css(i,"padding-top"),d=s.css(i,"padding-bottom");s.css(i,{visibility:"visible",overflow:"hidden",height:e,marginTop:r,marginBottom:l,paddingTop:p,paddingBottom:d}),a(i,{height:0,marginTop:0,marginBottom:0,paddingTop:0,paddingBottom:0},{duration:t,queue:!1,complete:function(){c(i),s.css(i,{visibility:"visible",overflow:"hidden",height:e,marginTop:r,marginBottom:l,paddingTop:p,paddingBottom:d}),n&&n.apply(i)}})}return this}function v(i,t,n){return 0==o.height(i)?f(i,t,n):h(i,t,n),this}function y(){return y}var b,T,P,w,x,z,B,C,I=n.normalizeCssEvent("AnimationEnd"),j=n.normalizeCssEvent("TransitionEnd"),k=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,O=n.css3PropPrefix+"transform",E={};return E[b=n.normalizeCssProperty("animation-name")]=E[T=n.normalizeCssProperty("animation-duration")]=E[w=n.normalizeCssProperty("animation-delay")]=E[P=n.normalizeCssProperty("animation-timing-function")]="",E[x=n.normalizeCssProperty("transition-property")]=E[z=n.normalizeCssProperty("transition-duration")]=E[C=n.normalizeCssProperty("transition-delay")]=E[B=n.normalizeCssProperty("transition-timing-function")]="",t.mixin(y,{off:!1,speeds:{normal:400,fast:200,slow:600},animate:a,fadeIn:g,fadeOut:m,fadeTo:d,fadeToggle:u,hide:c,scrollToTop:l,slideDown:f,slideToggle:v,slideUp:h,show:r,toggle:p}),i.fx=y});
//# sourceMappingURL=sourcemaps/fx.js.map
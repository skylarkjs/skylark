/**
 * skylark-langx - A simple JavaScript language extension library, including class support, Evented class, Deferred class and some commonly used tool functions.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.5
 * @link www.skylarkjs.org
 * @license MIT
 */
define([],function(){function n(n){return n&&n.constructor===Array}function t(n){return!l(n)&&!c(n)&&"number"==typeof n.length&&!u(n)}function r(n){return"boolean"==typeof n}function o(n){return"undefined"!=typeof n}function e(n){return null!=n&&n.nodeType==n.DOCUMENT_NODE}function i(n){var t;for(t in n)if(null!==n[t])return!1;return!0}function u(n){return"function"==y(n)}function c(n){return n&&n instanceof Node}function f(n){return"number"==typeof n}function a(n){return"object"==y(n)}function s(n){return a(n)&&!p(n)&&Object.getPrototypeOf(n)==Object.prototype}function l(n){return"string"==typeof n}function p(n){return n&&n==n.window}function b(n){if(n){var t=location.protocol+"//"+location.hostname;return location.port&&(t+=":"+location.port),n.startsWith(t)}}var y=function(){var n={};return"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(t){n["[object "+t+"]"]=t.toLowerCase()}),function(t){return null==t?String(t):n[toString.call(t)]||"object"}}();return{isArray:n,isArrayLike:t,isBoolean:r,isDefined:o,isDocument:e,isEmptyObject:i,isFunction:u,isHtmlNode:c,isNumber:f,isObject:a,isPlainObject:s,isString:l,isSameOrigin:b,isWindow:p,type:y}});
//# sourceMappingURL=sourcemaps/types.js.map

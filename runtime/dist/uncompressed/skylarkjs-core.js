/**
 * skylarkjs - An Elegant JavaScript Library and HTML5 Application Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.3
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                exports: null
            };
            require(id);
        } else {
            resolved[id] = factory;
        }
    };
    require = globals.require = function(deps,cb) {
        function requireOne(id) {
            if (!map.hasOwnProperty(id)) {
                throw new Error('Module ' + id + ' has not been defined');
            }
            var module = map[id];
            if (!module.exports) {
                var args = [];

                module.deps.forEach(function(dep){
                    args.push(require(dep));
                })

                module.exports = module.factory.apply(window, args);
            }
            return module.exports;
        }
        var onedep = typeof deps === "string";
        if (!cb && onedep) {
            return requireOne(deps);
        }
        if (onedep) {
            deps = [deps];
        }
        var modules = deps.map(function(id){
            return requireOne(id);
        });
        if (cb) {
            cb.apply(null,modules);
        } else {
            return modules;
        }

    };
  }

  factory(define,require);

  function xhrGet(url,callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()   {
        if (this.readyState == 4) {
            callback(this.response);
        } 
    }
    xhr.open("GET",url,true);
    xhr.send( null );
  }
  if (!isAmd) {
    var skylarkjs = require("skylarkjs");

    if (isCmd) {
      exports = skylarkjs;
    } else {
      globals.skylarkjs = skylarkjs;
    }
  } else {
    require.config({
        baseUrl : "./"
    });
  }

require([
  "skylarkjs"
], function (skylark,http) { 
    xhrGet("./slax-config.json",function(res){
        if (!res) {
            console.error("can't find the slax-config.json!");
            return;
        }
        var cfg = JSON.parse(res);
        if (isAmd) {
            require.config(cfg.runtime);
        }
        
        if (cfg.contextPath) {
              cfg.baseUrl = cfg.contextPath;
        }

        var app = skylark.spa(cfg);

        globals.go =  function(path) {
            app.go(path);
        };

        app.prepare().then(function(){
            app.run();
        })

    });


});    

})(function(define,require) {
define('skylark-langx/skylark',[], function() {
    var skylark = {

    };
    return skylark;
});

define('skylark-utils/skylark',["skylark-langx/skylark"], function(skylark) {
    return skylark;
});

define('skylarkjs/skylark',[
    "skylark-utils/skylark"
], function(skylark) {
    return skylark;
});

define('skylark-langx/langx',["./skylark"], function(skylark) {
    var toString = {}.toString,
        concat = Array.prototype.concat,
        indexOf = Array.prototype.indexOf,
        slice = Array.prototype.slice,
        filter = Array.prototype.filter;


    var createClass = (function() {
        function extendClass(ctor, props, options) {
            // Copy the properties to the prototype of the class.
            var proto = ctor.prototype,
                _super = ctor.superclass.prototype,
                noOverrided = options && options.noOverrided;

            for (var name in props) {
                if (name === "constructor") {
                    continue;
                }

                // Check if we're overwriting an existing function
                proto[name] = typeof props[name] == "function" && !noOverrided && typeof _super[name] == "function" ?
                    (function(name, fn, superFn) {
                        return function() {
                            var tmp = this.overrided;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this.overrided = superFn;

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);

                            this.overrided = tmp;

                            return ret;
                        };
                    })(name, props[name], _super[name]) :
                    props[name];
            }

            return ctor;
        }

        return function createClass(props, parent, options) {

            var _constructor = props.constructor;
            if (_constructor === Object) {
                _constructor = function() {
                    if (this.init) {
                        this.init.apply(this, arguments);
                    }
                };
            };

            var klassName = props.klassName || "",
                ctor = new Function(
                    "return function " + klassName + "() {" +
                    "var inst = this," +
                    " ctor = arguments.callee;" +
                    "if (!(inst instanceof ctor)) {" +
                    "inst = Object.create(ctor.prototype);" +
                    "}" +
                    "ctor._constructor.apply(inst, arguments);" +
                    "return inst;" +
                    "}"
                )();
            ctor._constructor = _constructor;
            parent = parent || Object;
            // Populate our constructed prototype object
            ctor.prototype = Object.create(parent.prototype);

            // Enforce the constructor to be what we expect
            ctor.prototype.constructor = ctor;
            ctor.superclass = parent;

            // And make this class extendable
            ctor.__proto__ = parent;

            if (!ctor.partial) {
                ctor.partial = function(props, options) {
                    return extendClass(this, props, options);
                };
            }
            if (!ctor.inherit) {
                ctor.inherit = function(props,options) {
                    return createClass(props, this,options);
                };
            }

            ctor.partial(props,options);

            return ctor;
        }
    })();


    function debounce(fn, wait) {
        var timeout,
            args,
            later = function() {
                fn.apply(null, args);
            };

        return function() {
            args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    var Deferred = function() {
        this.promise = new Promise(function(resolve, reject) {
            this._resolve = resolve;
            this._reject = reject;
        }.bind(this));

        this.resolve = Deferred.prototype.resolve.bind(this);
        this.reject = Deferred.prototype.reject.bind(this);
    };

    Deferred.prototype.resolve = function(value) {
        this._resolve.call(this.promise, value);
        return this;
    };

    Deferred.prototype.reject = function(reason) {
        this._reject.call(this.promise, reason);
        return this;
    };


    Deferred.prototype.then = function(callback, errback, progback) {
        return this.promise.then(callback, errback, progback);
    };

    Deferred.all = function(array) {
        return Promise.all(array);
    };

    Deferred.first = function(array) {
        return Promise.race(array);
    };

    Deferred.when = function(valueOrPromise, callback, errback, progback) {
        var receivedPromise = valueOrPromise && typeof valueOrPromise.then === "function";
        var nativePromise = receivedPromise && valueOrPromise instanceof Promise;

        if (!receivedPromise) {
            if (arguments.length > 1) {
                return callback ? callback(valueOrPromise) : valueOrPromise;
            } else {
                return new Deferred().resolve(valueOrPromise);
            }
        } else if (!nativePromise) {
            var deferred = new Deferred(valueOrPromise.cancel);
            valueOrPromise.then(deferred.resolve, deferred.reject, deferred.progress);
            valueOrPromise = deferred.promise;
        }

        if (callback || errback || progback) {
            return valueOrPromise.then(callback, errback, progback);
        }
        return valueOrPromise;
    };

    Deferred.reject = function(err) {
        var d = new Deferred();
        d.reject(err);
        return d.promise;
    };

    Deferred.resolve = function(data) {
        var d = new Deferred();
        d.resolve(data);
        return d.promise;
    };

    Deferred.immediate = Deferred.resolve;

    var Evented = createClass({
        on: function(events,selector,data,callback,ctx,/*used internally*/one) {
	        var self = this,
	        	_hub = this._hub || (this._hub = {});

	        if (isPlainObject(events)) {
	        	ctx = callback;
	            each(events, function(type, fn) {
	                self.on(type,selector, data, fn, ctx, one);
	            });
	            return this;
	        }

	        if (!isString(selector) && !isFunction(callback)) {
	        	ctx = callback;
	            callback = data;
	            data = selector;
	            selector = undefined;
	        }

	        if (isFunction(data)) {
	            ctx = callback;
	            callback = data;
	            data = null;
	        }

	        if (isString(events)) {
	            events = events.split(/\s/)
	        }

	        events.forEach(function(name) {
	            (_hub[name] || (_hub[name] = [])).push({
	                fn: callback,
	                selector: selector,
	                data: data,
	                ctx: ctx,
	                one: one
	            });
	        });

	        return this;
	    },

	    one: function(events,selector,data,callback,ctx) {
	        return this.on(events,selector,data,callback,ctx,1);
	    },

	    trigger: function(e/*,argument list*/) {
	    	if (!this._hub) {
	    		return this;
	    	}

	    	var self = this;

	    	if (isString(e)) {
	    		e = new CustomEvent(e);
	    	}

	        var args = slice.call(arguments,1);
            if (isDefined(args)) {
                args = [e].concat(args);
            } else {
                args = [e];
            }
	        [e.type || e.name ,"all"].forEach(function(eventName){
		        var listeners = self._hub[eventName];
		        if (!listeners){
		        	return;
		        }

		        var len = listeners.length,
		        	reCompact = false;

		        for (var i = 0; i < len; i++) {
		        	var listener = listeners[i];
		            if (e.data) {
		                if (listener.data) {
		                    e.data = mixin({}, listener.data, e.data);
		                }
		            } else {
		                e.data = listener.data || null;
		            }
		            listener.fn.apply(listener.ctx, args);
		            if (listener.one){
		            	listeners[i] = null;
		            	reCompact = true;
		            }
		        }

		        if (reCompact){
		        	self._hub[eventName] = compact(listeners);
		        }

	        });
	        return this;
	    },

	    listened: function(event) {
	        var evtArr = ((this._hub || (this._events = {}))[event] || []);
	        return evtArr.length > 0;
	    },

	    listenTo: function(obj, event, callback,/*used internally*/one) {
	        if (!obj) {
	        	return this;
	        }

	        // Bind callbacks on obj,
	        if (isString(callback)) {
	        	callback = this[callback];
	        }

	        if (one){
		        obj.one(event,callback,this);
	        } else {
		        obj.on(event,callback,this);
	        }

	        //keep track of them on listening.
	        var listeningTo = this._listeningTo || (this._listeningTo = []),
	        	listening;

	        for (var i=0;i<listeningTo.length;i++) {
	        	if (listeningTo[i].obj == obj) {
	        		listening = listeningTo[i];
	        		break;
	        	}
	        }
	        if (!listening) {
	        	listeningTo.push(
	        		listening = {
	        			obj : obj,
	        			events : {
	        			}
	        	    }
	        	);
	        }
	        var listeningEvents = listening.events,
	        	listeningEvent = listeningEvents[event] = listeningEvents[event] || [];
	        if (listeningEvent.indexOf(callback)==-1) {
	        	listeningEvent.push(callback);
	        }

	        return this;
	    },

	    listenToOnce: function(obj, event, callback) {
	    	return this.listenTo(obj,event,callback,1);
	    },

	    off: function(events, callback) {
	        var _hub = this._hub || (this._hub = {});
	        if (isString(events)) {
	            events = events.split(/\s/)
	        }

	        events.forEach(function(name) {
	            var evts = _hub[name];
	            var liveEvents = [];

	            if (evts && callback) {
	                for (var i = 0, len = evts.length; i < len; i++) {
	                    if (evts[i].fn !== callback && evts[i].fn._ !== callback)
	                        liveEvents.push(evts[i]);
	                }
	            }

	            if (liveEvents.length) {
	            	_hub[name] = liveEvents;
	            } else {
	            	delete _hub[name];
	            }
	        });

	        return this;
	    },
	    unlistenTo : function(obj, event, callback) {
	        var listeningTo = this._listeningTo;
	        if (!listeningTo) {
	        	return this;
	        }
	        for (var i = 0; i < listeningTo.length; i++) {
	          var listening = listeningTo[i];

	          if (obj && obj != listening.obj) {
	        	  continue;
	          }

	          var listeningEvents = listening.events;
	          for (var eventName in listeningEvents) {
	        	 if (event && event != eventName) {
	        		 continue;
	        	 }

	        	 listeningEvent = listeningEvents[eventName];

	        	 for (var j=0;j<listeningEvent.length;j++) {
	        		 if (!callback || callback == listeningEvent[i]) {
	        			 listening.obj.off(eventName, listeningEvent[i], this);
	        			 listeningEvent[i] = null;
	        		 }
	        	 }

	        	 listeningEvent = listeningEvents[eventName] = compact(listeningEvent);

	        	 if (isEmptyObject(listeningEvent)) {
	        		 listeningEvents[eventName] = null;
	        	 }

	          }

	          if (isEmptyObject(listeningEvents)) {
	        	  listeningTo[i] = null;
	          }
	        }

	        listeningTo = this._listeningTo = compact(listeningTo);
	        if (isEmptyObject(listeningTo)) {
	        	this._listeningTo = null;
	        }

	        return this;
	    }
    });

    function compact(array) {
        return filter.call(array, function(item) {
            return item != null;
        });
    }

    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase();
    }

    function deserializeValue(value) {
        try {
            return value ?
                value == "true" ||
                (value == "false" ? false :
                    value == "null" ? null :
                    +value + "" == value ? +value :
                    /^[\[\{]/.test(value) ? JSON.parse(value) :
                    value) : value;
        } catch (e) {
            return value;
        }
    }

    function each(obj, callback) {
        var length, key, i, undef, value;

        if (obj) {
            length = obj.length;

            if (length === undef) {
                // Loop object items
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        value = obj[key];
                        if (callback.call(value, key, value) === false) {
                            break;
                        }
                    }
                }
            } else {
                // Loop array items
                for (i = 0; i < length; i++) {
                    value = obj[i];
                    if (callback.call(value, i, value) === false) {
                        break;
                    }
                }
            }
        }

        return this;
    }

    function flatten(array) {
        if (isArrayLike(array)) {
            var result = [];
            for (var i = 0;i<array.length;i++) {
                var item = array[i];
                if (isArrayLike(item)) {
                    for (var j = 0; j<item.length;j++) {
                        result.push(item[j]);
                    }
                } else {
                    result.push(item);
                }
            }
            return result;
        } else {
            return array;
        }
        //return array.length > 0 ? concat.apply([], array) : array;
    }

    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }

    var getAbsoluteUrl = (function() {
        var a;

        return function(url) {
            if (!a) a = document.createElement('a');
            a.href = url;

            return a.href;
        };
    })();

    function getQueryParams(url) {
        var url = url || window.location.href,
            segs = url.split("?"),
            params = {};

        if (segs.length > 1) {
            segs[1].split("&").forEach(function(queryParam) {
                var nv = queryParam.split('=');
                params[nv[0]] = nv[1];
            });
        }
        return params;
    }

    function grep(array, callback) {
        var out = [];

        each(array, function(i, item) {
            if (callback(item, i)) {
                out.push(item);
            }
        });

        return out;
    }

    function inArray(item, array) {
        if (!array) {
            return -1;
        }
        var i;

        if (array.indexOf) {
            return array.indexOf(item);
        }

        i = array.length;
        while (i--) {
            if (array[i] === item) {
                return i;
            }
        }

        return -1;
    }

    function inherit(ctor, base) {
        var f = function() {};
        f.prototype = base.prototype;

        ctor.prototype = new f();
    }

    function isArray(object) {
        return object instanceof Array;
    }

    function isArrayLike(obj) {
        return !isString(obj) && !(obj.nodeName && obj.nodeName == "#text") && typeof obj.length == 'number';
    }

    function isBoolean(obj) {
        return typeof(obj) === "boolean";
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }

    function isFunction(value) {
        return type(value) == "function";
    }

    function isObject(obj) {
        return type(obj) == "object";
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }

    function isString(obj) {
        return typeof obj === 'string';
    }

    function isWindow(obj) {
        return obj && obj == obj.window;
    }

    function isDefined(obj) {
        return typeof obj !== 'undefined';
    }

    function isNumber(obj) {
        return typeof obj == 'number';
    }

    function isSameOrigin(href) {
        if (href) {
            var origin = location.protocol + '//' + location.hostname;
            if (location.port) {
                origin += ':' + location.port;
            }
            return href.startsWith(origin);
        }
    }


    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
        	if (obj[name] !== null) {
        		return false;
        	}
        }
        return true;
    }

    function makeArray(obj, offset, startWith) {
        return (startWith || []).concat(Array.prototype.slice.call(obj, offset || 0));
    }

    function map(elements, callback) {
        var value, values = [],
            i, key
        if (isArrayLike(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback.call(elements[i], elements[i], i);
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback.call(elements[key], elements[key], key);
                if (value != null) values.push(value)
            }
        return flatten(values)
    }

    function nextTick(fn) {
        requestAnimationFrame(fn);
        return this;
    }

    function proxy(fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
            var proxyFn = function() {
                return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
            }
            return proxyFn;
        } else if (isString(context)) {
            if (args) {
                args.unshift(fn[context], fn)
                return proxy.apply(null, args)
            } else {
                return proxy(fn[context], fn);
            }
        } else {
            throw new TypeError("expected function");
        }
    }


    function toPixel(value) {
        // style values can be floats, client code may want
        // to round for integer pixels.
        return parseFloat(value) || 0;
    }

    var type = (function() {
        var class2type = {};

        // Populate the class2type map
        each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        return function type(obj) {
            return obj == null ? String(obj) :
                class2type[toString.call(obj)] || "object";
        };
    })();

    function trim(str) {
        return str == null ? "" : String.prototype.trim.call(str);
    }

    function removeItem(items,item) {
    	if (isArray(items)) {
        	var idx = items.indexOf(item);
        	if (idx != -1) {
        		items.splice(idx, 1);
        	}
    	} else if (isPlainObject(items)) {
    		for (var key in items) {
    			if (items[key] == item) {
    				delete items[key];
    				break;
    			}
    		}
    	}

    	return this;
    }

    function _mixin(target, source, deep, safe) {
        for (var key in source) {
            if (!source.hasOwnProperty(key)) {
                continue;
            }
            if (safe && target[key] !== undefined) {
                continue;
            }
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                    target[key] = {};
                }
                if (isArray(source[key]) && !isArray(target[key])) {
                    target[key] = [];
                }
                _mixin(target[key], source[key], deep, safe);
            } else if (source[key] !== undefined) {
                target[key] = source[key]
            }
        }
        return target;
    }

    function _parseMixinArgs(args) {
        var params = slice.call(arguments, 0);
        target = params.shift(),
            deep = false;
        if (isBoolean(params[params.length - 1])) {
            deep = params.pop();
        }

        return {
            target: target,
            sources: params,
            deep: deep
        };
    }

    function mixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, false);
        });
        return args.target;
    }

    function safeMixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, true);
        });
        return args.target;
    }

    function substitute( /*String*/ template,
        /*Object|Array*/
        map,
        /*Function?*/
        transform,
        /*Object?*/
        thisObject) {
        // summary:
        //    Performs parameterized substitutions on a string. Throws an
        //    exception if any parameter is unmatched.
        // template:
        //    a string with expressions in the form `${key}` to be replaced or
        //    `${key:format}` which specifies a format function. keys are case-sensitive.
        // map:
        //    hash to search for substitutions
        // transform:
        //    a function to process all parameters before substitution takes


        thisObject = thisObject || window;
        transform = transform ?
            proxy(thisObject, transform) : function(v) {
                return v;
            };

        function getObject(key, map) {
            if (key.match(/\./)) {
                var retVal,
                    getValue = function(keys, obj) {
                        var _k = keys.pop();
                        if (_k) {
                            if (!obj[_k]) return null;
                            return getValue(keys, retVal = obj[_k]);
                        } else {
                            return retVal;
                        }
                    };
                return getValue(key.split(".").reverse(), map);
            } else {
                return map[key];
            }
        }

        return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,
            function(match, key, format) {
                var value = getObject(key, map);
                if (format) {
                    value = getObject(format, thisObject).call(thisObject, value, key);
                }
                return transform(value, key).toString();
            }); // String
    }

    var _uid = 1;
    function uid(obj) {
        return obj._uid || obj.id || (obj._uid = _uid++);
    }

    function uniq(array) {
        return filter.call(array, function(item, idx) {
            return array.indexOf(item) == idx;
        })
    }

    function langx() {
        return langx;
    }

    mixin(langx, {
        camelCase: function(str) {
            return str.replace(/-([\da-z])/g, function(a) {
                return a.toUpperCase().replace('-', '');
            });
        },

        compact: compact,

        dasherize: dasherize,

        debounce: debounce,

        Deferred: Deferred,

        Evented: Evented,

        deserializeValue: deserializeValue,

        each: each,

        flatten: flatten,

        funcArg: funcArg,

        getQueryParams: getQueryParams,

        inArray: inArray,

        isArray: isArray,

        isArrayLike: isArrayLike,

        isBoolean: isBoolean,

        isDefined: function(v) {
            return v !== undefined;
        },

        isDocument: isDocument,

        isEmptyObject: isEmptyObject,

        isFunction: isFunction,

        isObject: isObject,

        isPlainObject: isPlainObject,

        isNumber: isNumber,

        isString: isString,

        isSameOrigin: isSameOrigin,

        isWindow: isWindow,

        klass: function(props, parent, options) {
            return createClass(props, parent, options);
        },

        lowerFirst: function(str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        },

        makeArray: makeArray,

        map: map,

        mixin: mixin,

        nextTick : nextTick,

        proxy: proxy,

        removeItem: removeItem,

        returnTrue: function() {
            return true;
        },

        returnFalse: function() {
            return false;
        },

        safeMixin: safeMixin,

        substitute: substitute,

        toPixel: toPixel,

        trim: trim,

        type: type,

        uid: uid,

        uniq: uniq,

        upperFirst: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },

        URL: window.URL || window.webkitURL

    });

    return skylark.langx = langx;
});

/**
 * skylark-router - An Elegant HTML5 Routing Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.2
 * @link www.skylarkjs.org
 * @license MIT
 */
define('skylark-router/router',[
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark, langx) {

    var _curCtx,
        _prevCtx,
        _baseUrl,
        _homePath,
        _routes = {},
        _cache = {},
        _hub = new langx.Evented();

    function createEvent(type,props) {
        var e = new CustomEvent(type,props);
        return langx.safeMixin(e, props);
    }

    var Route = langx.Evented.inherit({
        klassName: "Route",
        init: function(name, setting) {
            setting = langx.mixin({}, setting);
            var pathto = setting.pathto || "",
                pattern = pathto,
                paramNames = pattern.match(/\:([a-zA-Z0-9_]+)/g);
            if (paramNames !== null) {
                paramNames = paramNames.map(function(paramName) {
                    return paramName.substring(1);
                });
                pattern = pattern.replace(/\:([a-zA-Z0-9_]+)/g, '(.*?)');
            } else {
                paramNames = [];
            }
            if (pattern === "*") {
                pattern = "(.*)";
            } else {
                pattern = pattern.replace("/", "\\/");
            }

            this._setting = setting;
            this.name = name;
            this.pathto = pathto;
            this.paramNames = paramNames;
            this.params = pattern;
            this.regex = new RegExp("^" + pattern + "$", "");

            var self = this;
            ["entering", "entered", "exiting", "exited"].forEach(function(eventName) {
                if (langx.isFunction(setting[eventName])) {
                    self.on(eventName, setting[eventName]);
                }
            });
        },

        enter: function(ctx,query) {
            if (query) {
                var r = this._entering(ctx),
                    self = this;

                return langx.Deferred.when(r).then(function(){
                    var e = createEvent("entering", {
                        route: self,
                        result: true
                    });

                    self.trigger(e);

                    return e.result;
                });
            } else {
                this._entered(ctx);

                this.trigger(createEvent("entered", langx.safeMixin({
                    route: this
                }, ctx)));
                return this;
            }
        },

        exit: function(ctx, query) {
            if (query) {
                var ok = this._exiting(ctx);
                if (!ok) {
                    return false;
                }

                var e = createEvent("exiting", {
                    route: this,
                    result: true
                });

                this.trigger(e);

                return e.result;
            } else {
                this._exited(ctx);
                this.trigger(createEvent("exited", langx.safeMixin({
                    route: this
                }, ctx)));

                return this;
            }
        },

        match: function(path) {
            var names = this.paramNames,
                x = path.indexOf('?'),
                path = ~x ? path.slice(0, x) : decodeURIComponent(path),
                m = this.regex.exec(path);

            if (!m) {
                return false
            };

            var params = {};
            for (var i = 1, len = m.length; i < len; ++i) {
                var name = names[i - 1],
                    val = decodeURIComponent(m[i]);
                params[name] = val;
            }

            return params;
        },

        path: function(params) {
            var path = this.pathto;
            if (params) {
                path = path.replace(/:([a-zA-Z0-9_]+)/g, function(match, paramName) {
                    return params[paramName];
                });
            }
            return path;
        },

        _entering: function(ctx) {
            return true;
        },
        _entered: function(ctx) {
            return true;
        },
        _exiting: function(ctx) {
            return true;
        },
        _exited: function(ctx) {
            return true;
        },
    });

    function current() {
        return _curCtx;
    }

    // refresh the current route
    function dispatch(ctx) {

        if (_curCtx) {
            var ret = _curCtx.route.exit({
                path: _curCtx.path,
                params: _curCtx.params
            }, true);
            if (!ret) {
                return;
            }
        }

        _prevCtx = _curCtx;
        _curCtx = ctx;
        if (!_curCtx.route) {
            var m = map(_curCtx.path);
            _curCtx.route = m.route;
            _curCtx.params = m.params;
        }

        var r = _curCtx.route.enter({
            path: _curCtx.path,
            params: _curCtx.params
        },true);

        langx.Deferred.when(r).then(function() {
            _hub.trigger(createEvent("routing", {
                current: _curCtx,
                previous: _prevCtx
            }));

            _curCtx.route.enter({
                path: _curCtx.path,
                params: _curCtx.params
            },false);

            if (_prevCtx) {
                _prevCtx.route.exit({
                    path: _prevCtx.path,
                    params: _prevCtx.params
                }, false);
            }

            _hub.trigger(createEvent("routed", {
                current: _curCtx,
                previous: _prevCtx
            }));
        });
    }

    function go(path, force) {
        if (!force && _curCtx && _curCtx.path == path) {
            return false;
        }
        var ctx = map(path);
        if (ctx) {
            ctx.path = path;

            if (router.useHistoryApi) {
                var state = {
                    path: path
                }

                window.history.pushState(state, document.title, (_baseUrl + path).replace("//", "/"));
                window.dispatchEvent(createEvent("popstate", {
                    state: state
                }));
            } else if (router.useHashbang) {
                var newHash = "#!" + path;
                if (window.location.hash !== newHash) {
                    window.location.hash = newHash;
                } else {
                    dispatch(ctx);
                };
            } else {
                dispatch(ctx);
            }
        }
        return true;
    }

    function map(path, noCache) {
        var finded = false;
        if (!noCache) {
            finded = _cache[path];
            if (finded) {
                return finded;
            }
        }
        langx.each(_routes, function(name, route) {
            var ret = route.match(path);
            if (ret) {
                finded = {
                    route: route,
                    params: ret
                }
                return false;
            }
            return true;
        });
        if (finded && !noCache) {
            _cache[path] = finded;
        }
        return finded;
    }

    function path(routeName, params) {
        var route = _routes[routeName],
            path;
        if (route) {
            path = route.path(params);
        }
        return path;
    }

    function previous() {
        return _prevCtx;
    }

    function baseUrl(path) {
        if (langx.isDefined(path)) {
            _baseUrl = path;
            return this;
        } else {
            return _baseUrl;
        }
    }

    function hub(){
        return _hub;
    }

    function homePath(path) {
        if (langx.isDefined(path)) {
            _homePath = path;
            return this;
        } else {
            return _homePath;
        }
    }

    function route(name, setting) {
        if (langx.isDefined(setting)) {
            var settings = {};
            settings[name] = setting;
            routes(settings);
            return this;
        } else {
            return _routes[name];
        }
    }

    function routes(settings) {
        if (!langx.isDefined(settings)) {
            return langx.mixin({}, _routes);
        } else {
            for (var name in settings) {
                _routes[name] = new router.Route(name, settings[name]);
            }
        }
    }

    //starts routing urls
    function start() {
        if (router.useHashbang == null && router.useHistoryApi == null) {
            if (window.location.host) {
                //web access
                router.useHistoryApi = true;
            } else {
                // local access
                router.useHashbang = true;
            }
        }

        var initPath = "";

        if (router.useHistoryApi) {
            initPath = window.location.pathname;
            if (_baseUrl === undefined) {
                _baseUrl = initPath.replace(/\/$/, "");
            }
            initPath = initPath.replace(_baseUrl, "") || _homePath || "/";
        } else if (router.useHashbang) {
            initPath = window.location.hash.replace("#!", "") || _homePath || "/";
        } else {
            initPath = "/";
        }

        if (!initPath.startsWith("/")) {
            initPath = "/" + initPath;
        }
        /*
        eventer.on(document.body, "click", "a[href]", function(e) {
            var elm = e.currentTarget,
                url = elm.getAttribute("href");

            if (url == "#") {
                return;
            }
            if (url && langx.isSameOrigin(elm.href)) {
                if (url.indexOf(_baseUrl) === 0) {
                    url = url.substr(_baseUrl.length);
                    eventer.stop(e);
                    url = url.replace('#!', '');
                    go(url);
                }
            }
        });
        */
        if (router.useHistoryApi) {
            window.addEventListener("popstate", function(e) {
                if(e.state) dispatch(e.state);
                e.preventDefault();
            });
        } else if (router.useHashbang) {
            window.addEventListener("hashchange", function(e) {
                dispatch({
                    path: window.location.hash.replace(/^#!/, "")
                });
                e.preventDefault();
            });
        }

        go(initPath);
    }

    var router = function() {
        return router;
    };

    langx.mixin(router, {
        "Route": Route,

        // Current path being processed
        "current": current,

        // Changes the current path
        "go": go,

        "map": map,

        "hub": hub,

        "off": function() {
            _hub.off.apply(_hub, arguments);
        },

        "on": function() {
            _hub.on.apply(_hub, arguments);
        },

        "one": function() {
            _hub.one.apply(_hub, arguments);
        },

        // Returns the path of the named route
        "path": path,

        "previous": previous,

        "baseUrl": baseUrl,

        "homePath": homePath,

        "route": route,

        "routes": routes,

        //starts routing urls
        "start": start,

        "trigger": function(e) {
            _hub.trigger(e);
            return this;
        },

        "useHistoryApi": null,
        "useHashbang": null
    });

    return skylark.router = router;
});

define('skylarkjs/router',[
    "skylark-router/router"
], function(router) {
    return router;
});

define('skylark-spa/spa',[
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-router/router"
], function(skylark, langx, router) {
    var Deferred = langx.Deferred;

    function createEvent(type,props) {
        var e = new CustomEvent(type,props);
        return langx.safeMixin(e, props);
    }

    var Route = router.Route = router.Route.inherit({
        klassName: "SpaRoute",

        init: function(name, setting) {
            this.overrided(name, setting);
            this.content = setting.content;
            this.data = setting.data;
            //this.lazy = !!setting.lazy;
            var self = this;
            ["preparing", "rendering", "rendered"].forEach(function(eventName) {
                if (langx.isFunction(setting[eventName])) {
                    self.on(eventName, setting[eventName]);
                }
            });
        },

        _entering: function(ctx) {
            if (!this._prepared) {
                return this.prepare();
            }
            return this;
        },

        getConfigData: function(key) {
            return key ? this.data[key] : this.data;
        },

        prepare: function() {
            var d = new Deferred(),
                setting = this._setting,
                controllerSetting = setting.controller,
                controller = this.controller,

                self = this,
                content = setting.content,
                contentPath = setting.contentPath;

            
            if (controllerSetting && !controller) {
                require([controllerSetting.type], function(type) {
                    controller = self.controller = new type(controllerSetting);
                    d.resolve();
                });
            } else {
                d.resolve();
            }

            return d.then(function() {
                var e = createEvent("preparing", {
                    route: self,
                    result: true
                });
                self.trigger(e);
                return Deferred.when(e.result).then(function() {
                    self._prepared = true;
                });
            });
        },

        render: function(ctx) {
            var e = createEvent("rendering", {
                route: this,
                context: ctx,
                content: this.content
            });
            this.trigger(e);
            return e.content;
        },

        trigger: function(e) {
            var controller = this.controller;
            if (controller) {
                return controller.perform(e);
            } else {
                return this.overrided(e);
            }
        }
    });

    var RouteController = langx.Evented.inherit({
        klassName: "SpaRouteController",

        init: function(route, setting) {
            setting = setting || {};
            this.content = setting.content;
            this.data = setting.data;
        },

        getConfigData: function(key) {
            return key ? this.data[key] : this.data;
        },

        perform: function(e) {
            var eventName = e.type;
            if (this[eventName]) {
                return this[eventName].call(this, e);
            }

        }
    });

    var Page = langx.Evented.inherit({
        klassName: "SpaPage",

        init: function(params) {
            params = langx.mixin({
                "routeViewer": "body"
            }, params);

            this._params = params;
            this._rvc = document.querySelector(params.routeViewer);
            this._router = router;

            router.on("routed", langx.proxy(this, "refresh"));
        },

        prepare: function() {

        },

        //Refreshes the route
        refresh: function() {
            var curCtx = router.current(),
                prevCtx = router.previous();
            var content = curCtx.route.render(curCtx);
            if (langx.isString(content)) {
                this._rvc.innerHTML = content;
            } else {
                this._rvc.innerHTML = "";
                this._rvc.appendChild(content);
            }
            curCtx.route.trigger(createEvent("rendered", {
                content: content
            }));
        }
    });

    var Plugin = langx.Evented.inherit({
        klassName: "SpaPlugin",

        init: function(name, setting) {
            this.name = name;
            this._setting = setting; 
        },


        prepare: function() {
            var d = new Deferred(),
                setting = this._setting,
                controllerSetting = setting.controller,
                controller = this.controller,
                self = this;

            if (controllerSetting && !controller) {
                require([controllerSetting.type], function(type) {
                    controller = self.controller = new type(controllerSetting);
                    router.on(setting.hookers, {
                        plugin: self
                    }, langx.proxy(controller.perform, controller));
                    d.resolve();
                });
            } else {
                langx.each(setting.hookers, function(eventName, hooker) {
                    router.on(eventName, {
                        plugin: self
                    }, hooker);
                });
                d.resolve();
            }

            return d.then(function() {
                self._prepared = true;
            });
        }
    });

    var PluginController = langx.Evented.inherit({
        klassName: "SpaPluginController",

        init: function(plugin) {
            this.plugin = plugin;
        },

        perform: function(e) {
            var eventName = e.type;
            if (this[eventName]) {
                return this[eventName].call(this, e);
            }

        }
    });

    var Application = langx.Evented.inherit({
        klassName: "SpaApplication",

        init: function(config) {
            if (app) {
                return app;
            }
            var plugins = this._plugins = {};

            config = this._config = langx.mixin({
                plugins: {}
            }, config, true);

            langx.each(config.plugins, function(pluginName, setting) {
                plugins[pluginName] = new Plugin(pluginName, setting);
            });

            router.routes(config.routes);

            this._router = router;

            this._page = new spa.Page(config.page);

            document.title = config.title;
            var baseUrl = config.baseUrl; 
            if (baseUrl === undefined) {
                baseUrl = config.baseUrl = (new langx.URL(document.baseURI)).pathname;
            }
            router.baseUrl(baseUrl);

            if (config.homePath) {
                router.homePath(config.homePath);
            }

            app = this;
        },

        getConfig: function(key) {
            return key ? this._config[key] : this._config;
        },

        go: function(path) {
            router.go(path);
            return this;
        },

        page: function() {
            return this._page;
        },

        prepare: function() {
            if (this._prepared) {
                return Deferred.resolve();
            }
            var self = this;
            router.trigger(createEvent("starting", {
                spa: self
            }));
            var promises1 = langx.map(router.routes(), function(route, name) {
                    if (route.lazy === false) {
                        return route.prepare();
                    }
                }),
                promises2 = langx.map(this._plugins, function(plugin, name) {
                    return plugin.prepare();
                });


            return Deferred.all(promises1.concat(promises2)).then(function(){
                this._prepared = true;
            });
        },

        run: function() {
            this._router.start();
            router.trigger(createEvent("started", {
                spa: this
            }));
        }
    });

    var app;
    var spa = function(config) {
        if (!app) {
            window[config.name || "app"] = app = new spa.Application(config);
        }

        return app;
    }

    langx.mixin(spa, {
        "Application": Application,

        "Page": Page,

        "Plugin": Plugin,
        "PluginController": PluginController,

        "Route": Route,
        "RouteController": RouteController

    });

    return skylark.spa = spa;
});

define('skylarkjs/spa',[
    "skylark-spa/spa"
], function(spa) {
    return spa;
});

define('skylarkjs/langx',[
    "skylark-langx/langx"
], function(langx) {
    return langx;
});

define('skylarkjs/core',[
    "./skylark",
    "./router",
    "./spa",
    "./langx"
], function(skylark) {
    return skylark;
})
;
define('skylarkjs', ['skylarkjs/core'], function (main) { return main; });


},this);
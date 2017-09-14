define(["./skylark"], function(skylark) {
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
        return !isString(obj) && typeof obj.length == 'number';
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
        }

    });

    return skylark.langx = langx;
});

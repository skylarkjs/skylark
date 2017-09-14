define([
    "./skylark",
    "./langx",
    "./browser",
    "./finder",
    "./noder",
    "./datax"
], function(skylark, langx, browser, finder, noder, datax) {
    var mixin = langx.mixin,
        each = langx.each,
        slice = Array.prototype.slice,
        uid = langx.uid,
        ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
        eventMethods = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
        },
        readyRE = /complete|loaded|interactive/;

    function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
            if (!source) {
                source = event;
            }

            langx.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name];
                event[name] = function() {
                    this[predicate] = langx.returnTrue;
                    return sourceMethod && sourceMethod.apply(source, arguments);
                }
                event[predicate] = langx.returnFalse;
            });
        }
        return event;
    }

    function parse(event) {
        var segs = ("" + event).split(".");
        return {
            type: segs[0],
            ns: segs.slice(1).sort().join(" ")
        };
    }

    //create a custom dom event
    var createEvent = (function() {
        var EventCtors = [
                window["CustomEvent"], // 0 default
                window["CompositionEvent"], // 1
                window["DragEvent"], // 2
                window["Event"], // 3
                window["FocusEvent"], // 4
                window["KeyboardEvent"], // 5
                window["MessageEvent"], // 6
                window["MouseEvent"], // 7
                window["MouseScrollEvent"], // 8
                window["MouseWheelEvent"], // 9
                window["MutationEvent"], // 10
                window["ProgressEvent"], // 11
                window["TextEvent"], // 12
                window["TouchEvent"], // 13
                window["UIEvent"], // 14
                window["WheelEvent"] // 15
            ],
            NativeEvents = {
                "compositionstart": 1, // CompositionEvent
                "compositionend": 1, // CompositionEvent
                "compositionupdate": 1, // CompositionEvent

                "beforecopy": 2, // DragEvent
                "beforecut": 2, // DragEvent
                "beforepaste": 2, // DragEvent
                "copy": 2, // DragEvent
                "cut": 2, // DragEvent
                "paste": 2, // DragEvent

                "drag": 2, // DragEvent
                "dragend": 2, // DragEvent
                "dragenter": 2, // DragEvent
                "dragexit": 2, // DragEvent
                "dragleave": 2, // DragEvent
                "dragover": 2, // DragEvent
                "dragstart": 2, // DragEvent
                "drop": 2, // DragEvent

                "abort": 3, // Event
                "change": 3, // Event
                "error": 3, // Event
                "selectionchange": 3, // Event
                "submit": 3, // Event
                "reset": 3, // Event

                "focus": 4, // FocusEvent
                "blur": 4, // FocusEvent
                "focusin": 4, // FocusEvent
                "focusout": 4, // FocusEvent

                "keydown": 5, // KeyboardEvent
                "keypress": 5, // KeyboardEvent
                "keyup": 5, // KeyboardEvent

                "message": 6, // MessageEvent

                "click": 7, // MouseEvent
                "contextmenu": 7, // MouseEvent
                "dblclick": 7, // MouseEvent
                "mousedown": 7, // MouseEvent
                "mouseup": 7, // MouseEvent
                "mousemove": 7, // MouseEvent
                "mouseover": 7, // MouseEvent
                "mouseout": 7, // MouseEvent
                "mouseenter": 7, // MouseEvent
                "mouseleave": 7, // MouseEvent


                "textInput": 12, // TextEvent

                "touchstart": 13, // TouchEvent
                "touchmove": 13, // TouchEvent
                "touchend": 13, // TouchEvent

                "load": 14, // UIEvent
                "resize": 14, // UIEvent
                "select": 14, // UIEvent
                "scroll": 14, // UIEvent
                "unload": 14, // UIEvent,

                "wheel": 15 // WheelEvent
            }
        ;

        function getEventCtor(type) {
            var idx = NativeEvents[type];
            if (!idx) {
                idx = 0;
            }
            return EventCtors[idx];
        }

        return function(type, props) {
            //create a custom dom event

            if (langx.isString(type)) {
                props = props || {};
            } else {
                props = type;
                type = props.type;
            }
            var parsed = parse(type);
            type = parsed.type;

            props = langx.mixin({
                bubbles: false,
                cancelable: true
            }, props);

            if (parsed.ns) {
                props.namespace = parsed.ns;
            }

            var ctor = getEventCtor(type),
                e = new ctor(type, props);

            langx.safeMixin(e, props);

            return compatible(e);
        };
    })();

    function createProxy(event) {
        var key,
            proxy = {
                originalEvent: event
            };
        for (key in event) {
            if (key !== "keyIdentifier" && !ignoreProperties.test(key) && event[key] !== undefined) {
                proxy[key] = event[key];
            }
        }
        return compatible(proxy, event);
    }

    var
        specialEvents = {},
        focusinSupported = "onfocusin" in window,
        focus = { focus: "focusin", blur: "focusout" },
        hover = { mouseenter: "mouseover", mouseleave: "mouseout" },
        realEvent = function(type) {
            return hover[type] || (focusinSupported && focus[type]) || type;
        },
        handlers = {},
        EventBindings = langx.klass({
            init: function(target, event) {
                this._target = target;
                this._event = event;
                this._bindings = [];
            },

            add: function(fn, options) {
                var bindings = this._bindings,
                    binding = {
                        fn: fn,
                        options: langx.mixin({}, options)
                    };

                bindings.push(binding);

                var self = this;
                if (!self._listener) {
                    self._listener = function(domEvt) {
                        var elm = this,
                            e = createProxy(domEvt),
                            args = domEvt._args,
                            binding = self._bindings,
                            ns = e.namespace;

                        if (langx.isDefined(args)) {
                            args = [e].concat(args);
                        } else {
                            args = [e];
                        }

                        bindings.some(function(binding) {
                            var match = elm;
                            if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                                return true;
                            }
                            var fn = binding.fn,
                                options = binding.options || {},
                                selector = options.selector,
                                one = options.one,
                                data = options.data;

                            if (ns && ns != options.ns) {
                                return false;
                            }
                            if (selector) {
                                match = finder.closest(e.target, selector);
                                if (match && match !== elm) {
                                    langx.mixin(e, {
                                        currentTarget: match,
                                        liveFired: elm
                                    });
                                } else {
                                    return false;
                                }
                            }

                            if (langx.isDefined(data)) {
                                e.data = data;
                            }

                            if (one) {
                                self.remove(fn, options);
                            }

                            var result = fn.apply(match, args);

                            if (result === false) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            return false;
                        });;
                    };

                    var event = self._event;
                    if (event in hover) {
                        var l = self._listener;
                        self._listener = function(e) {
                            var related = e.relatedTarget;
                            if (!related || (related !== this && !noder.contains(this, related))) {
                                return l.apply(this, arguments);
                            }
                        }
                    }

                    if (self._target.addEventListener) {
                        self._target.addEventListener(realEvent(event), self._listener, false);
                    } else {
                        console.warn("invalid eventer object", self._target);
                    }
                }

            },
            remove: function(fn, options) {
                options = langx.mixin({}, options);

                function matcherFor(ns) {
                    return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
                }
                var matcher;
                if (options.ns) {
                    matcher = matcherFor(options.ns);
                }

                this._bindings = this._bindings.filter(function(binding) {
                    var removing = (!fn || fn === binding.fn) &&
                        (!matcher || matcher.test(binding.options.ns)) &&
                        (!options.selector || options.selector == binding.options.selector);

                    return !removing;
                });
                if (this._bindings.length == 0) {
                    if (this._target.removeEventListener) {
                        this._target.removeEventListener(realEvent(this._event), this._listener, false);
                    }
                    this._listener = null;
                }
            }
        }),
        EventsHandler = langx.klass({
            init: function(elm) {
                this._target = elm;
                this._handler = {};
            },

            // add a event listener
            // selector Optional
            register: function(event, callback, options) {
                // Seperate the event from the namespace
                var parsed = parse(event);

                event = parsed.type;

                var events = this._handler;

                // Check if there is already a handler for this event
                if (events[event] === undefined) {
                    events[event] = new EventBindings(this._target, event);
                }

                // Register the new callback function
                events[event].add(callback, langx.mixin({
                    ns: parsed.ns
                }, options)); // options:{selector:xxx}
            },

            // remove a event listener
            unregister: function(event, fn, options) {
                // Check for parameter validtiy
                var events = this._handler,
                    parsed = parse(event);
                event = parsed.type;

                var listener = events[event];

                if (listener) {
                    listener.remove(fn, langx.mixin({
                        ns: parsed.ns
                    }, options));
                }
            }
        }),

        findHandler = function(elm) {
            var id = uid(elm),
                handler = handlers[id];
            if (!handler) {
                handler = handlers[id] = new EventsHandler(elm);
            }
            return handler;
        };

    function off(elm, events, selector, callback) {
        var $this = this
        if (langx.isPlainObject(events)) {
            langx.each(events, function(type, fn) {
                off(elm, type, selector, fn);
            })
            return $this;
        }

        if (!langx.isString(selector) && !langx.isFunction(callback) && callback !== false) {
            callback = selector;
            selector = undefined;
        }

        if (callback === false) {
            callback = langx.returnFalse;
        }

        if (typeof events == "string") {
            if (events.indexOf(",") > -1) {
                events = events.split(",");
            } else {
                events = events.split(/\s/);
            }
        }

        var handler = findHandler(elm);

        if (events) events.forEach(function(event) {

            handler.unregister(event, callback, {
                selector: selector,
            });
        });
        return this;
    }

    function on(elm, events, selector, data, callback, one) {

        var autoRemove, delegator;
        if (langx.isPlainObject(events)) {
            langx.each(events, function(type, fn) {
                on(elm, type, selector, data, fn, one);
            });
            return this;
        }

        if (!langx.isString(selector) && !langx.isFunction(callback)) {
            callback = data;
            data = selector;
            selector = undefined;
        }

        if (langx.isFunction(data)) {
            callback = data;
            data = undefined;
        }

        if (callback === false) {
            callback = langx.returnFalse;
        }

        if (typeof events == "string") {
            if (events.indexOf(",") > -1) {
                events = events.split(",");
            } else {
                events = events.split(/\s/);
            }
        }

        var handler = findHandler(elm);

        events.forEach(function(event) {
            if (event == "ready") {
                return ready(callback);
            }
            handler.register(event, callback, {
                data: data,
                selector: selector,
                one: !!one
            });
        });
        return this;
    }

    function one(elm, events, selector, data, callback) {
        on(elm, events, selector, data, callback, 1);

        return this;
    }

    function stop(event) {
        if (window.document.all) {
            event.keyCode = 0;
        }
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        }
        return this;
    }

    function trigger(evented, type, args) {
        var e;
        if (type instanceof Event) {
            e = type;
        } else {
            e = createEvent(type, args);
        }
        e._args = args;

        (evented.dispatchEvent || evented.trigger).call(evented, e);

        return this;
    }

    function ready(callback) {
        // need to check if document.body exists for IE as that browser reports
        // document ready when it hasn't yet created the body elm
        if (readyRE.test(document.readyState) && document.body) {
            callback()
        } else {
            document.addEventListener('DOMContentLoaded', callback, false);
        }

        return this;
    }

    var keyCodeLookup = {
        "delete": 46
    };
    //example:
    //shortcuts(elm).add("CTRL+ALT+SHIFT+X",function(){console.log("test!")});
    function shortcuts(elm) {

        var registry = datax.data(elm, "shortcuts");
        if (!registry) {
            registry = {};
            datax.data(elm, "shortcuts", registry);
            var run = function(shortcut, event) {
                var n = event.metaKey || event.ctrlKey;
                if (shortcut.ctrl == n && shortcut.alt == event.altKey && shortcut.shift == event.shiftKey) {
                    if (event.keyCode == shortcut.keyCode || event.charCode && event.charCode == shortcut.charCode) {
                        event.preventDefault();
                        if ("keydown" == event.type) {
                            shortcut.fn(event);
                        }
                        return true;
                    }
                }
            };
            on(elm, "keyup keypress keydown", function(event) {
                if (!(/INPUT|TEXTAREA/.test(event.target.nodeName))) {
                    for (var key in registry) {
                        run(registry[key], event);
                    }
                }
            });

        }

        return {
            add: function(pattern, fn) {
                var shortcutKeys;
                if (pattern.indexOf(",") > -1) {
                    shortcutKeys = pattern.toLowerCase().split(",");
                } else {
                    shortcutKeys = pattern.toLowerCase().split(" ");
                }
                shortcutKeys.forEach(function(shortcutKey) {
                    var setting = {
                        fn: fn,
                        alt: false,
                        ctrl: false,
                        shift: false
                    };
                    shortcutKey.split("+").forEach(function(key) {
                        switch (key) {
                            case "alt":
                            case "ctrl":
                            case "shift":
                                setting[key] = true;
                                break;
                            default:
                                setting.charCode = key.charCodeAt(0);
                                setting.keyCode = keyCodeLookup[key] || key.toUpperCase().charCodeAt(0);
                        }
                    });
                    var regKey = (setting.ctrl ? "ctrl" : "") + "," + (setting.alt ? "alt" : "") + "," + (setting.shift ? "shift" : "") + "," + setting.keyCode;
                    registry[regKey] = setting;
                })
            }

        };

    }

    function eventer() {
        return eventer;
    }

    langx.mixin(eventer, {
        create: createEvent,

        off: off,

        on: on,

        one: one,

        proxy: createProxy,

        ready: ready,

        shortcuts: shortcuts,

        stop: stop,

        trigger: trigger,

    });

    return skylark.eventer = eventer;
});

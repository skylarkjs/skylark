/**
 * skylark-spa - An Elegant  HTML5 Single Page Application Framework.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
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
    require = globals.require = function(id) {
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
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (isAmd) {
    define([
      "skylark-spa",
    ],function(skylarkjs){
      return skylarkjs;
    });
  } else {    
    var skylarkjs = require("skylark-spa/main");

    if (isCmd) {
      exports = skylarkjs;
    } else {
      globals.skylarkjs = skylarkjs;
    }
  }

})(function(define,require) {

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
                    router.trigger(createEvent("prepared", {
                        route: self
                    }));
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

            router.on("routing", langx.proxy(this, "refresh"));
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
            //eventer.trigger(curCtx.route, "rendered", {
            //    route: curCtx.route,
            //    node: this._$rvc.domNode
            //});
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
                var e = createEvent("preparing", {
                    result: true
                });
                self.trigger(e);
                return Deferred.when(e.result).then(function() {
                    self._prepared = true;
                });
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
                baseUrl = config.baseUrl = require.toUrl("");
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
            var self = this;
            var promises1 = langx.map(router.routes(), function(route, name) {
                    if (route.lazy === false) {
                        return route.prepare();
                    }
                }),
                promises2 = langx.map(this._plugins, function(plugin, name) {
                    return plugin.prepare();
                });


            return Deferred.all(promises1.concat(promises2)).then(function() {
                return router.trigger(createEvent("starting", {
                    spa: self
                }));
            });
        },

        run: function() {
            this._router.start();
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

define('skylark-spa/main',[
    "skylark-langx/skylark",
    "./spa"
], function(skylark) {
    return skylark;
});

define('skylark-spa', ['skylark-spa/main'], function (main) { return main; });


},this);
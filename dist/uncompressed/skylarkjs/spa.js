define([
    "skylark-utils/skylark",
    "skylark-utils/langx",
    "skylark-utils/eventer",
    "skylark-router/router",
    "skylark-utils/velm",
    "skylark-utils/finder",
    "skylark-utils/noder",
    "skylark-utils/async"
], function(skylark, langx, eventer, router, velm, finder, noder, async) {
    var Deferred = async.Deferred;

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
                var e = eventer.create("preparing", {
                    route: self,
                    result: true
                });
                eventer.trigger(self, e);

                return Deferred.when(e.result).then(function() {
                    eventer.trigger(router.hub(), "prepared", {
                        route: self
                    });
                    self._prepared = true;
                });
            });
        },

        render: function(ctx) {
            var e = eventer.create("rendering", {
                route: this,
                context: ctx,
                content: this.content
            });
            eventer.trigger(this, e);
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

    var RouteController = langx.klass({
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

    var Page = langx.klass({
        klassName: "SpaPage",

        init: function(params) {
            params = langx.mixin({
                "routeViewer": "body"
            }, params);

            this._params = params;
            this._$rvc = velm.find(params.routeViewer);
            this._router = router;

            router.on("routing", langx.proxy(this, "refresh"));
        },

        prepare: function() {

        },

        //Refreshes the route
        refresh: function() {
            var curCtx = router.current(),
                prevCtx = router.previous();
            this._$rvc.html(curCtx.route.render(curCtx));
            //eventer.trigger(curCtx.route, "rendered", {
            //    route: curCtx.route,
            //    node: this._$rvc.domNode
            //});
        }
    });

    var Plugin = langx.klass({
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
                var e = eventer.create("preparing", {
                    result: true
                });
                eventer.trigger(self, e);
                return Deferred.when(e.result).then(function() {
                    self._prepared = true;
                });
            });
        },

        trigger: function(type, props) {
            eventer.trigger(new langx.Evented(), type, props);
            return this;
        }
    });

    var PluginController = langx.klass({
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
                return eventer.trigger(router, "starting", {
                    spa: self
                });
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
        "RouteController": RouteController,

        "velm": velm
    });

    return skylark.spa = spa;
});

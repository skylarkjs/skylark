define([
    "skylark-langx/skylark",
    "skylark-langx/langx",
    "skylark-router/router"
], function(skylark, langx, router) {
    var Deferred = langx.Deferred;

    function createEvent(type, props) {
        var e = new CustomEvent(type, props);
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

        getNamedValue: function() {
            return window.location.pathname.match(this.regex);
        },

        prepare: function() {
            var d = new Deferred(),
                setting = this._setting,
                controllerSetting = setting.controller,
                controller = this.controller,

                self = this,
                content = setting.content,
                contentPath = setting.contentPath;

            require([controllerSetting.type], function(type) {
                controller = self.controller = new type(controllerSetting);
                d.resolve();
            });

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
                route: curCtx.route,
                content: content
            }));
        }
    });

    var Plugin = langx.Evented.inherit({
        klassName: "SpaPlugin",

        init: function(name, setting) {
            this.name = name;

            if (langx.isString(setting.hookers)) {
                setting.hookers = setting.hookers.split(" ");
            }
            this._setting = setting;
        },

        isHooked: function(eventName) {
            var hookers = this._setting.hookers || [];
            return hookers.indexOf(eventName) > -1;
        },

        prepare: function() {
            var d = new Deferred(),
                setting = this._setting,
                controllerSetting = setting.controller,
                controller = this.controller,
                self = this;
            require([controllerSetting.type], function(type) {
                controller = self.controller = new type(controllerSetting);
                router.on(setting.hookers, {
                    plugin: self
                }, langx.proxy(controller.perform, controller));
                d.resolve();
            });
            return d.then(function() {
                var e = createEvent("preparing", {
                    plugin: self,
                    result: true
                });
                self.trigger(e);
                return Deferred.when(e.result).then(function() {
                    self._prepared = true;
                });
            });
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

        go: function(path, force) {
            router.go(path, force);
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

            var promises0 = langx.map(this._plugins, function(plugin, name) {
                if (plugin.isHooked("starting")) {
                    return plugin.prepare();
                }
            });

            return Deferred.all(promises0).then(function() {
                router.trigger(createEvent("starting", {
                    spa: self
                }));
                var promises1 = langx.map(router.routes(), function(route, name) {
                        if (route.lazy === false) {
                            return route.prepare();
                        }
                    }),
                    promises2 = langx.map(self._plugins, function(plugin, name) {
                        if (!plugin.isHooked("starting")) {
                            return plugin.prepare();
                        }
                    });


                return Deferred.all(promises1.concat(promises2)).then(function() {
                    self._prepared = true;
                });
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

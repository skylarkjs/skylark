const path = require('path');
const del = require('del');
const copy = require('copy-dir');
const fs = require('fs');
const tpl = require('./scaffold/tpl');
const util = require('./util');
const sjspkg = require('../package.json');

exports = module.exports = {
    "add": add,
    "remove": remove,
    "list": list
};


const loadTemplate = tpl.loadTemplate;
const copyTemplate = tpl.copyTemplate;
const mkdir = util.mkdir;
const rmdir = util.rmdir;
const write = util.write;


function add(root, addingPlugins) {
    let slaxCfg = JSON.parse(util.read(path.join(root, "/src/slax-config.json"))),
        plugins = slaxCfg.plugins;

    addingPlugins.split(",").forEach(function(onePlugin) {
        let a = onePlugin.split(":"),
            name = a[0],
            hookers = a[1] ? a[1].split("+") : [];


        if (plugins[name]) {
            console.warn("the plugin:" + name + " has been defined!");
            return;
        }
        var pluginJs = loadTemplate('scripts/plugins/PluginController.js');
        pluginJs.locals.name = name;
        pluginJs.locals.hookers = hookers;

        var controllerName = name.charAt(0).toUpperCase() + name.slice(1) + "Controller";
        mkdir(root + '/src/scripts/plugins/' + name, function() {
            write(root + '/src/scripts/plugins/' + name + "/" + controllerName + ".js", pluginJs.render());
        });

        plugins[name] = {
            hookers: hookers.join(" "),
            controller: {
                type: "scripts/plugins/" + name + "/" + controllerName
            }
        };

    });

    write(root + '/src/slax-config.json', JSON.stringify(slaxCfg, null, 2) + '\n');

    return plugins;

}

function remove(root, deletingPlugins) {
    let slaxCfg = JSON.parse(util.read(path.join(root, "/src/slax-config.json"))),
        plugins = slaxCfg.plugins;

    deletingPlugins.split(",").forEach(function(name) {
        if (!plugins[name]) {
            console.warn("the plugin:" + name + " does not exist!");
            return;
        }

        rmdir(root + '/src/scripts/plugins/' + name, function() {});

        delete plugins[name];

    });

    write(root + '/src/slax-config.json', JSON.stringify(slaxCfg, null, 2) + '\n');

}

function list(root) {
    let slaxCfg = JSON.parse(util.read(path.join(root, "/src/slax-config.json"))),
        plugins = slaxCfg.plugins;

    console.log("the plugin list are following:");
    for (var name in plugins) {
        console.log(" " + name);
    };

}

const path = require('path');
const del = require('del');
const copy = require('copy-dir');
const nfs = require('skynode-nfs');
const tpl = require('../../helpers/tpl');
//const util = require('./util');

exports = module.exports = {
    "add": add,
    "remove": remove,
    "list": list
};


const loadTemplate = tpl.loadTemplate;
const copyTemplate = tpl.copyTemplate;
const mkdir = nfs.mkdirSync;
const rmdir = nfs.rmdirSync;
const write = nfs.writeSync;


function add(root, addingPlugins) {
    let slaxCfg = nfs.readJsonSync(path.join(root, "/src/slax-config.json")),
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

    nfs.writeJsonSync(root + '/src/slax-config.json', slaxCfg);

    return plugins;

}

function remove(root, deletingPlugins) {
    let slaxCfg = nfs.readJsonSync(path.join(root, "/src/slax-config.json")),
        plugins = slaxCfg.plugins;

    deletingPlugins.split(",").forEach(function(name) {
        if (!plugins[name]) {
            console.warn("the plugin:" + name + " does not exist!");
            return;
        }

        rmdir(root + '/src/scripts/plugins/' + name, function() {});

        delete plugins[name];

    });

    nfs.writeJsonSync(root + '/src/slax-config.json', JSON.stringify(slaxCfg, null, 2) + '\n');

}

function list(root) {
    let slaxCfg = nfs.readJsonSync(path.join(root, "/src/slax-config.json")),
        plugins = slaxCfg.plugins;

    console.log("the plugin list are following:");
    for (var name in plugins) {
        console.log(" " + name);
    };

}

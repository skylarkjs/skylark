const path = require('path');
const del = require('del');
const copydir = require('copy-dir');
const fs = require('fs');
const tpl = require('./scaffold/tpl');
const util = require('./util');
const sjspkg = require('../package.json');
const routes = require('./routes');

exports = module.exports = create;


const loadTemplate = tpl.loadTemplate;
const copyTemplate = tpl.copyTemplate;
const mkdir = util.mkdir;
const write = util.write;


function create(name, root, options) {
    var wait = 5;

    function complete() {
        if (--wait) return

        console.log();
        console.log('   install dependencies:');
        console.log('     %s cd %s && npm install', prompt, path);
        console.log();
        console.log('   run the app:');

        console.log();
    }

    console.log(root);
    // index.html
    var indexHtml = loadTemplate('index.html'),
        slaxCfgJson = loadTemplate('slax-config.json');

    // App name
    indexHtml.locals.name = name;
    indexHtml.locals.views = [];

    slaxCfgJson.locals.name = name;
    slaxCfgJson.locals.title = options.title || name;
    slaxCfgJson.locals.sversion = sjspkg.runtime.version;

    mkdir(root, function() {
        mkdir(root + '/src', function() {
            mkdir(root + '/src/assets', function() {
                mkdir(root + '/src/assets/images');
                mkdir(root + '/src/assets/css', function() {
                    switch (options.css) {
                        case 'less':
                            copyTemplate('assets/css/style.less', root + '/src/assets/css/style.less')
                            break
                        case 'sass':
                            copyTemplate('assets/css/style.sass', root + '/src/assets/css/style.sass')
                            break
                        default:
                            copyTemplate('assets/css/style.css', root + '/src/assets/css/style.css')
                            break
                    }
                });
            });


            mkdir(root + '/src/scripts', function() {
                mkdir(root + '/src/scripts/plugins', function() {
                    mkdir(root + '/src/scripts/plugins/app', function() {
                        copyTemplate('scripts/plugins/AppController.js', root + '/src/scripts/plugins/app/AppController.js');
                    });
                });
                mkdir(root + '/src/scripts/routes');
            });

        });


        mkdir(root + '/lib', function() {
            copydir.sync(path.join(__dirname, "../runtime/dist"), root + '/lib/skylarkjs', function(stat, filepath, filename) {
                if (stat === 'directory' && filename === 'included') {
                    return false;
                }
                return true;
            });
        });

        const deployedSlaxFile = './deploy/' + name + '.slax';

        var slaxConfig = JSON.parse(slaxCfgJson.render());

        // package.json
        var pkg = {
            name: name,
            version: '0.0.0',
            private: true,
            scripts: {
                "browse": "sjs browse " + deployedSlaxFile,
                "serve": "sjs serve " + deployedSlaxFile,
                "build": "sjs build .",
                "deploy": "sjs deploy .",
                "route-add": "sjs routes add . ",
                "route-list": "sjs routes list . ",
                "route-delete": "sjs routes delete .",
                "plugin-add": "sjs plugins add .",
                "plugin-list": "sjs plugins list .",
                "plugin-delete": "sjs plugins delete ."
            },
            dependencies: {}
        }

        if (options.routes) {
            mkdir(root + '/src/scripts/plugins/highlight', function() {
                copyTemplate('scripts/plugins/HighlightController.js', root + '/src/scripts/plugins/highlight/HighlightController.js');
            });
            slaxConfig.plugins.highlight = {
                hookers: "routing routed",
                controller: {
                    type: "scripts/plugins/highlight/HighlightController"
                }
            };
        }

        write(root + '/src/slax-config.json', JSON.stringify(slaxConfig, null, 2) + '\n');
        var added;
        if (options.routes) {
            added = routes.add(root, options.routes);
        }


        // write files
        write(root + '/package.json', JSON.stringify(pkg, null, 2) + '\n')

        indexHtml.locals.views = added;
        write(root + '/src/index.html', indexHtml.render())


        if (options.git) {
            copyTemplate('js/gitignore', root + '/.gitignore')
        }

        complete();
    })


}

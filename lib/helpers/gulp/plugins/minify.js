'use strict';

///require('amd-loader');

const path = require('path');
const rootPath = path.join(__dirname, '../../../..');

var sjs = require('skylark-runtime');

sjs.require.config({
    baseUrl : rootPath,
    waitSeconds : 60,
    paths: {
    },
      packages: [
         {
           name : "skylark-langx-arrays",
           location : "node_modules/skylark-langx-arrays/dist/uncompressed/skylark-langx-arrays",
            main: 'main'
         },
         {
           name : "skylark-langx-aspect",
           location : "node_modules/skylark-langx-aspect/dist/uncompressed/skylark-langx-aspect",
            main: 'main'
         },
         {
           name : "skylark-langx-async",
           location : "node_modules/skylark-langx-async/dist/uncompressed/skylark-langx-async",
            main: 'main'
         },
         {
           name : "skylark-langx-binary",
           location : "node_modules/skylark-langx-binary/dist/uncompressed/skylark-langx-binary",
            main: 'main'
         },
         {
           name : "skylark-langx-chars",
           location : "node_modules/skylark-langx-chars/dist/uncompressed/skylark-langx-chars",
            main: 'main'
         },
         {
           name : "skylark-langx-constructs",
           location : "node_modules/skylark-langx-constructs/dist/uncompressed/skylark-langx-constructs",
            main: 'main'
         },
         {
           name : "skylark-langx-datetimes",
           location : "node_modules/skylark-langx-datetimes/dist/uncompressed/skylark-langx-datetimes",
            main: 'main'
         },
         {
           name : "skylark-langx-emitter",
           location : "node_modules/skylark-langx-emitter/dist/uncompressed/skylark-langx-emitter",
            main: 'main'
         },
         {
           name : "skylark-langx-events",
           location : "node_modules/skylark-langx-events/dist/uncompressed/skylark-langx-events",
            main: 'main'
         },
         {
           name : "skylark-langx-funcs",
           location : "node_modules/skylark-langx-funcs/dist/uncompressed/skylark-langx-funcs",
            main: 'main'
         },
         {
           name : "skylark-langx-globals",
           location : "node_modules/skylark-langx-globals/dist/uncompressed/skylark-langx-globals",
            main: 'main'
         },
         {
           name : "skylark-langx-hoster",
           location : "node_modules/skylark-langx-hoster/dist/uncompressed/skylark-langx-hoster",
            main: 'main'
         },
         {
           name : "skylark-langx-klass",
           location : "node_modules/skylark-langx-klass/dist/uncompressed/skylark-langx-klass",
            main: 'main'
         },
         {
           name : "skylark-langx-maths",
           location : "node_modules/skylark-langx-maths/dist/uncompressed/skylark-langx-maths",
            main: 'main'
         },
         {
           name : "skylark-langx-ns",
           location : "node_modules/skylark-langx-ns/dist/uncompressed/skylark-langx-ns",
            main: 'main'
         },
         {
           name : "skylark-langx-numerics",
           location : "node_modules/skylark-langx-numerics/dist/uncompressed/skylark-langx-numerics",
            main: 'main'
         },
         {
           name : "skylark-langx-objects",
           location : "node_modules/skylark-langx-objects/dist/uncompressed/skylark-langx-objects",
            main: 'main'
         },
         {
           name : "skylark-langx-paths",
           location : "node_modules/skylark-langx-paths/dist/uncompressed/skylark-langx-paths",
            main: 'main'
         },
         {
           name : "skylark-langx-scripter",
           location : "node_modules/skylark-langx-scripter/dist/uncompressed/skylark-langx-scripter",
            main: 'main'
         },
         {
           name : "skylark-langx-strings",
           location : "node_modules/skylark-langx-strings/dist/uncompressed/skylark-langx-strings",
            main: 'main'
         },
         {
           name : "skylark-langx-topic",
           location : "node_modules/skylark-langx-topic/dist/uncompressed/skylark-langx-topic",
            main: 'main'
         },
         {
           name : "skylark-langx-types",
           location : "node_modules/skylark-langx-types/dist/uncompressed/skylark-langx-types",
            main: 'main'
         },
         {
           name : "skylark-langx-urls",
           location : "node_modules/skylark-langx-urls/dist/uncompressed/skylark-langx-urls",
            main: 'main'
         },
         {
           name : "skylark-net-http",
           location : "node_modules/skylark-net-http/dist/uncompressed/skylark-net-http",
            main: 'main'
         },
         {
           name : "skylark-langx",
           location : "node_modules/skylark-langx/dist/uncompressed/skylark-langx",
            main: 'main'
         },

          {
            name: 'skylark-acorn',
            location : "node_modules/skylark-acorn/dist/uncompressed/skylark-acorn",
//            location : "../../skylark-widgets-swt/src",
            main: 'main'
          },
          {
            name: 'skylark-sourcemap',
            location : "node_modules/skylark-sourcemap/dist/uncompressed/skylark-sourcemap",
//            location : "../../skylark-widgets-swt/src",
            main: 'main'
          },
          {
            name: 'skylark-espree',
            location : "node_modules/skylark-espree/dist/uncompressed/skylark-espree",
//            location : "../../skylark-widgets-swt/src",
            main: 'main'
          },
          {
            name: 'skylark-uglifyjs',
            location : "node_modules/skylark-uglifyjs/dist/uncompressed/skylark-uglifyjs",
//            location : "../../skylark-widgets-swt/src",
            main: 'main'
          },          

          {
            name: 'skylark-rjs',
            location : "node_modules/skylark-rjs/dist/uncompressed/skylark-rjs",
            main: 'main'
          }                 
        ]

});



var rjs = require('skynode-rjs');
///var uglifyjs = require('skylark-rjs/uglifyjs');
var through = require('through2');
var extend = require('node.extend');
var applySourceMap = require('vinyl-sourcemaps-apply');

var PluginError = require('plugin-error');

// Consts
var PLUGIN_NAME = 'gulp-skylark-minify';


module.exports = function(options) {
  options = extend({
    mangle: { 
      reserved: ['require','exports','module']
    }
  }, options);


  var stream = through.obj(function(file, enc, callback) {

      var hasSourceMaps = Boolean(file.sourceMap);

      if (file.isNull()) {
        return callback();
      }

      if (file.isStream()) {
        this.emit("error",new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        return callback();
      }

      if (hasSourceMaps) {
        options.sourceMap = {
          filename: file.sourceMap.file,
          includeSources: true
        };

        // UglifyJS generates broken source maps if the input source map
        // does not contain mappings.
        if (file.sourceMap.mappings) {
          options.sourceMap.content = file.sourceMap;
        }
      }

      var fileMap = {};
      fileMap[file.relative] = String(file.contents);

      sjs.require(["skylark-rjs/uglifyjs"],(uglifyjs) => {
    　　 Promise.resolve(uglifyjs.minify(fileMap,options)).then((mangled) => {
          if (!mangled || mangled.error) {
            this.emit("error",  file,  'unable to minify JavaScript:'+  mangled && mangled.error );
          }

          if (mangled.warnings) {
             mangled.warnings.forEach(function(warning) {
               console.warn('gulp-skylark-minify [%s]: %s', file.relative, warning);
             });
          }

          file.contents = Buffer.from(mangled.code);

          if (hasSourceMaps) {
            var sourceMap = JSON.parse(mangled.map);
            applySourceMap(file, sourceMap);
           }

          this.push(file);
          callback();
        });        

      });


  });

  return stream;
};


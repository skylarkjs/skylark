'use strict';

require('amd-loader');

///var sjs = require('skylark-runtime');



///var rjs = require('skynode-rjs');
///console.log("sjs:");
///console.dir(sjs);
var uglifyjs = require('skylark-rjs/uglifyjs');
////var uglifyjs = sjs.require("skylark-rjs/uglifyjs");
console.log("uglifyjs:");
console.log(uglifyjs);
var through = require('through2');
var path = require('path');
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

  return stream;
};


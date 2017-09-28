var gulp = require('gulp'),
    util = require('../utils'),
    del = require('del'),
    gutil = require('gulp-util'),
    copydir = require('copy-dir');


module.exports = function() {
    del.sync([util.dest + '/**/*', '!' + util.dest + "/"], {
        force: true
    });

    copydir.sync(util.lib_langx, util.dest + "included/skylark-langx");

    copydir.sync(util.lib_router, util.dest + "included/skylark-router");

    copydir.sync(util.lib_spa, util.dest + "included/skylark-spa");

    copydir.sync(util.lib_utils, util.dest + "included/skylark-utils");

    console.log('Clean folder:\n and recopy included libraries', util.dest);

};

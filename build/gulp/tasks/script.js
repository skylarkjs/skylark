var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    sourceMaps = require('gulp-sourcemaps'),
    amdOptimize = require('gulp-requirejs'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    util = require('../utils'),
     fs = require('fs');


var src = [util.src +  "**/*.js"];

var dest = util.dest+"uncompressed/";

var requireConfig = {
    baseUrl: util.src,
    out : util.pkg.name + "-all.js",
    packages : [{
       name : "skylark-utils" ,
       location :  util.lib+"skylark-utils-v0.9.0/uncompressed/skylark-utils"
    },
    {
       name : "skylark-router" ,
       location :  util.lib+"skylark-router-v0.9.0/uncompressed/skylark-router"
    },
    {
       name : util.pkg.name ,
       location :  util.src

    }],

    include: [
        util.pkg.name + "/main"
    ],
    exclude: [
    ]
};



module.exports = function() {
    var p =  new Promise(function(resolve, reject) {
     gulp.src(src)
        .on("error", reject)
        .pipe(gulp.dest(dest+util.pkg.name))
        .on("end",resolve);
    });

    return p.then(function(){
        return amdOptimize(requireConfig)
            .on("error",gutil.log)
            .pipe(header(fs.readFileSync(util.allinoneHeader, 'utf8')))
            .pipe(footer(fs.readFileSync(util.allinoneFooter, 'utf8')))
            .pipe(header(util.banner, {
                pkg: util.pkg
            })) 
            .pipe(gulp.dest(dest));
    })

};

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    sourceMaps = require('gulp-sourcemaps'),
    amdOptimize = require('gulp-amd-optimizer'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    util = require('../utils'),
     fs = require('fs');


var src = [util.src +  "**/*.js"];

var dest = util.dest;

var requireConfig = {
    baseUrl: util.src,
    paths: {
//       "skylark" : util.lib + "skylark"
    },
    include: [
    ],
    exclude: [
    ]
};

requireConfig.paths[util.pkg.name] = util.pkg.name;


var options = {
    umd: false
};

module.exports = function() {
    gulp.src(src)
        .pipe(sourceMaps.init())
        .pipe(sourceMaps.write())
        .pipe(uglify())
        .pipe(header(util.banner, {
            pkg: util.pkg
        }) )
        .pipe(gulp.dest(dest));

    var p =  new Promise(function(resolve, reject) {
        gulp.src(src)
            .pipe(sourceMaps.init())
            .pipe(sourceMaps.write())
            .pipe(uglify())
            .on("error", reject)
            .pipe(header(util.banner, {
                pkg: util.pkg
            }) )
            .pipe(gulp.dest(dest))
            .on("end",resolve);
    });

    return p.then(function(){
        return gulp.src(src)
            .pipe(amdOptimize(requireConfig, options))
            .pipe(concat(util.pkg.name + "-all.js"))
            .pipe(header(fs.readFileSync(util.allinoneHeader, 'utf8')))
            .pipe(footer(fs.readFileSync(util.allinoneFooter, 'utf8')))
            .pipe(uglify())
            .pipe(header(util.banner, {
                pkg: util.pkg
            })) 
            .pipe(gulp.dest(dest));

    });

};

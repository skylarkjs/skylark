var gulp = require('gulp'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    sourceMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    util = require('../utils');


var src = [util.src + '**/*.js'];

var dest = util.dest;

module.exports = function() {
    return gulp.src(src)
        .pipe(sourceMaps.init())
        .pipe(sourceMaps.write())
        .pipe(uglify())
        .pipe(header(util.banner, {
            pkg: util.pkg
        }) )
        .pipe(gulp.dest(dest));
};

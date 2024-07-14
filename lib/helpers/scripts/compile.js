
var path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    sourceMaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    texttojs = require('gulp-texttojs'),
    es6toamd = require('../parsers/js/es6tosjs'),
    cjstoamd = require('../parsers/js/cjstosjs'),
    noop = require("gulp-noop"),
    babel = require('gulp-babel'),    
    nfs = require('skynode-nfs');


//var include = setting.bundle && setting.bundle.standard && setting.bundle.standard.include;
//requireConfig.exclude = setting.rjspkgs.names.filter(function(name){
//    return !(include && include.indexOf(name)>-1);
//});


module.exports = function(packages,setting,done) {
    var srcPkgs = [
        ];

    var dest = path.resolve(setting.directories.obj,"./scripts");

    console.log("Building package:" + setting.pkg.name);
    var requireConfig = {
        baseUrl: dest+setting.pkg.name,
    //    out : setting.pkg.name + ".js",
        packages : [],
        paths: {
        },
    //    name : "skylark/main",
    //    exclude: [
    //    ],

        include: [
        ]
    };

    for (let srcPkgName in packages) {
        let srcPkgDir = path.resolve(setting.directories.src,packages[srcPkgName]) + "/",
            srcPkg = {
                pkgName : srcPkgName,
                pkgSrcJs : srcPkgDir  +  "**/*.js"
            };

        if (setting.prepare && setting.prepare.texttojs){
          srcPkg.pkgSrcTxt = [
              srcPkgDir +  "**/*.{" + setting.prepare.texttojs.join(",") +"}",
              "!" + srcPkgDir +  "**/*.js"
          ];
        } 

        srcPkgs.push(srcPkg);

        requireConfig.packages.push({
            name : srcPkgName,
            location : srcPkgDir
        });
    }    

    Array.prototype.push.apply(requireConfig.packages,setting.rjspkgs.namelocs);

    function build(){
        var promises = [];
        var moduleCovert = noop;
        if (setting.prepare) {
            if (setting.prepare.es6toamd ) {
                moduleCovert = es6toamd;
            } else if (setting.prepare.cjstoamd) {
                moduleCovert = cjstoamd;
            }

        }
        for (var i =0; i<srcPkgs.length;i++) {
            let srcPkg = srcPkgs[i];

            promises.push( new Promise(function(resolve, reject) {
             gulp.src(srcPkg.pkgSrcJs)
                .on("error",setting.log)
                .on("error", reject)
                .pipe(setting.prepare && setting.prepare.jsxtojs ? babel({
                    plugins: [path.join(__dirname, '../../../node_modules/@babel/plugin-transform-react-jsx/lib/index.js')]
                 }) : noop())
                .pipe(moduleCovert())
                .pipe(gulp.dest(path.resolve(dest,srcPkg.pkgName)))
                .on("end",resolve);
            }) );

            if (srcPkg.pkgSrcTxt) {
                promises.push( new Promise(function(resolve, reject) {
                    gulp.src(srcPkg.pkgSrcTxt)
                        .on("error",setting.log)
                        .on("error", reject)
                        .pipe(texttojs())
                        .pipe(gulp.dest(path.resolve(dest,srcPkg.pkgName)))
                        .on("end",resolve);
                }) );
            }
        }

        return Promise.all(promises);
    }

    return build().then(function(){
        done();
    }).catch(function(err){
        done(err);
    });
};


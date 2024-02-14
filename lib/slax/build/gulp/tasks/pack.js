var path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    sourceMaps = require('gulp-sourcemaps'),
    amdOptimize = require('../../../../helpers/gulp/plugins/requirejs'),
    minifer = require('../../../../helpers/gulp/plugins/minify'),
    ///uglifyes = require('uglify-es'),
    ///composer = require('gulp-uglify/composer'),
    ///uglify = composer(uglifyes, console),
    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    noop = require("gulp-noop"),
    setting = require('../settings'),
    nfs = require('skynode-nfs');


var srcPkgs = [];

var slaxJson = setting.slaxJson;

var src = path.resolve(setting.directories.obj,"./scripts");

var dest = path.resolve(setting.directories.dist,"./scripts");

var requireConfig = {
    baseUrl: dest,
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

if (slaxJson.scripts) {
    for (var srcPkgName in slaxJson.scripts) {
        srcPkgs.push({
          pkgName : srcPkgName,
          pkgSrcJs :   src + "/" + srcPkgName +  "/**/*.js"

        });

        requireConfig.packages.push({
            name : srcPkgName,
            location : src+"/"+ srcPkgName
        });
    }    
}


Array.prototype.push.apply(requireConfig.packages,setting.rjspkgs.namelocs);

//var include = setting.bundle && setting.bundle.standard && setting.bundle.standard.include;
//requireConfig.exclude = setting.rjspkgs.names.filter(function(name){
//    return !(include && include.indexOf(name)>-1);
//});


function build(){
    var promises = [];

    for (var i =0; i<srcPkgs.length;i++) {
        let srcPkg = srcPkgs[i];
        promises.push(new Promise(function(resolve, reject) {
            gulp.src(srcPkg.pkgSrcJs)
                .pipe(sourceMaps.init())
                .pipe(
                    process.env.NODE_ENV === 'development' ? noop() : 
                      minifer()
                      ///uglify({
                      ///  mangle: { 
                      ///    reserved: ['require','exports','module']
                      ///  }                
                      ///})
                )
                .on("error", reject)
                .pipe(header(setting.banner, {
                    pkg: setting.pkg
                }) )
                .pipe(sourceMaps.write("sourcemaps"))
                .pipe(gulp.dest(dest+"/"+srcPkg.pkgName))
                .on("end",resolve);
        }));
    }
    return Promise.all(promises);
}

function bundle(bundleName,bundleConfig) {
    let rqConfig = Object.assign({},requireConfig),
        suffix = "-" + bundleName;

    /*
    rqConfig.exclude = setting.rjspkgs.names.filter(function(pkgName){
        let isExcluded = !(include && include.indexOf(pkgName)>-1);

        return isExcluded;
    });
    */

    rqConfig.include = bundleConfig.include;
    rqConfig.exclude = bundleConfig.exlude;


    rqConfig.out = setting.pkg.name + suffix + ".js";

    console.log("out " +  rqConfig.out);
    console.log("bundle " +  bundleName);
    console.log(bundleConfig);

    return amdOptimize(rqConfig)
 //       .on("error",setting.log)
        .pipe(sourceMaps.init())
        .pipe(header(nfs.readFileSync(path.resolve(__dirname, "../fix/allinone-js.header"), 'utf8')))
        .pipe(footer(nfs.readFileSync(path.resolve(__dirname, "../fix/allinone-js.footer"), 'utf8')))
        .pipe(
            process.env.NODE_ENV === 'development' ?  noop() :
              minifer()
              ///uglify({
              ///  mangle: { 
              ///      reserved: ['require','exports','module']
              ///  }                
              ///})
        )
        .pipe(header(setting.banner, {
            pkg: setting.pkg
        })) 
        .pipe(sourceMaps.write("sourcemaps"))
        .pipe(gulp.dest(dest)) 
}


module.exports = function(done) {
    return build().then(function(){
        var promises2 = [],
            apps = slaxJson.apps || [];


        for (let i =0; i<apps.length;i++) {
            let app = apps[i];
            if (app.bundle) {
                promises2.push(bundle(app.name,app.bundle));
            }
        }

        return Promise.all(promises2).then(function(){
            done();
        }).catch(function(e){
            console.error(e);
            return Promise.reject(e);
        });
    },function(e){
        console.error(e);
        return Promise.reject(e);
    })

};



/*

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    sourceMaps = require('gulp-sourcemaps'),
    amdOptimize = require('../plugins/requirejs'),
    uglifyes = require('uglify-es'),
    composer = require('gulp-uglify/composer'),
    uglify = composer(uglifyes, console),
    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    setting = require('../settings'),
    fs = require('fs');

var src = [setting.dest+"uncompressed/" + setting.pkg.name + "*.js"];

var dest = setting.dest;

var requireConfig = {
    baseUrl: setting.dest+"uncompressed/"+ setting.pkg.name,
    out : setting.pkg.name + ".js",
    packages : [{
       name : setting.pkg.name ,
       location :  setting.dest+"uncompressed/"+ setting.pkg.name 
    }],
    paths: {
    },

    include: [
        setting.pkg.name + "/main"
    ],
    exclude: [
    ]
};

Array.prototype.push.apply(requireConfig.packages,setting.rjspkgs.namelocs);
//Array.prototype.push.apply(requireConfig.exclude,setting.rjspkgs.names);

var include = setting.bundle && setting.bundle.standard && setting.bundle.standard.include;
requireConfig.exclude = setting.rjspkgs.names.filter(function(name){
    return !(include && include.indexOf(name)>-1);
});

module.exports = function() {
    var p =  new Promise(function(resolve, reject) {
        gulp.src(src)
            .pipe(sourceMaps.init())
            .pipe(uglify({
                mangle: { 
                    reserved: ['require','exports','module']
                }                
            }))
            .on("error", reject)
            .pipe(header(setting.banner, {
                pkg: setting.pkg
            }) )
            .pipe(sourceMaps.write("sourcemaps"))
            .pipe(gulp.dest(dest+setting.pkg.name))
            .on("end",resolve);
    });

    return p.then(function(){
        return amdOptimize(requireConfig)
            .on("error",setting.log)
            .pipe(sourceMaps.init())
            .pipe(header(fs.readFileSync(setting.allinoneHeader, 'utf8')))
            .pipe(footer(fs.readFileSync(setting.allinoneFooter, 'utf8')))
            .pipe(uglify({
                mangle: { 
                    reserved: ['require','exports','module']
                }                
            }))
            .pipe(header(setting.banner, {
                pkg: setting.pkg
            })) 
            .pipe(sourceMaps.write("sourcemaps"))
            .pipe(gulp.dest(dest));

    });

};
*/
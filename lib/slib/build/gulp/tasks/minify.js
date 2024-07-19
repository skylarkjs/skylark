var path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    sourceMaps = require('gulp-sourcemaps'),
    amdOptimize = require('../../../../helpers/gulp/plugins/scripts/bunch'),
    minifer = require('../../../../helpers/gulp/plugins/scripts/minify'),

    ///uglifyes =  require('uglify-es'),
    ///uglifyes =  require('terser'), // uglify-es->terser lwf
    ///composer = require('gulp-uglify/composer'),
    ///uglify = composer(uglifyes, console),
    ///uglify = require('gulp-uglify');
    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    settings = require('../settings'),
    nfs = require('skynode-nfs');


var srcPkgs = [{
      pkgName : settings.pkg.name,
      pkgSrcJs :   settings.dest+"uncompressed/" + settings.pkg.name +  "/**/*.js"
    }];

var src = [settings.dest+"uncompressed/" + settings.pkg.name +  "/**/*.js"];

var dest = settings.dest;

var requireConfig = {
    baseUrl: settings.dest+"uncompressed/"+ settings.pkg.name,
//    out : settings.pkg.name + ".js",
    packages : [{
       name : settings.pkg.name ,
       location :  settings.dest+"uncompressed/"+ settings.pkg.name 
    }],

    paths: {
    },
//    name : "skylark/main",
//    exclude: [
//    ],

    include: [
        settings.pkg.name + "/main"
    ]
};

var srcPackageNames = [settings.pkg.name];

if (settings.secondaries) {
    for (var secondaryPkgName in settings.secondaries) {
        srcPkgs.push({
          pkgName : secondaryPkgName,
          pkgSrcJs :   settings.dest+"uncompressed/" + secondaryPkgName +  "/**/*.js"

        });

        requireConfig.packages.push({
            name : secondaryPkgName,
            location : settings.dest+"uncompressed/"+ secondaryPkgName
        });

        srcPackageNames.push(secondaryPkgName);
    }    
}


Array.prototype.push.apply(requireConfig.packages,settings.rjspkgs.namelocs);


function build(){
    var promises = [];

    for (var i =0; i<srcPkgs.length;i++) {
        let srcPkg = srcPkgs[i];
        promises.push(new Promise(function(resolve, reject) {
            gulp.src(srcPkg.pkgSrcJs)
                .pipe(sourceMaps.init())
                ///.pipe(uglify({
                ///    mangle: { 
                ///        reserved: ['require','exports','module']
                ///    },
                ///
                ///}))
                .pipe(minifer())
                .on("error", reject)
                .pipe(header(settings.banner, {
                    pkg: settings.pkg
                }) )
                .pipe(sourceMaps.write("sourcemaps"))
                .pipe(gulp.dest(dest+srcPkg.pkgName))
                .on("end",resolve);
        }));
    }
    return Promise.all(promises);
}

function bundle(bundleName,bundleConfig) {
    let rqConfig = Object.assign({},requireConfig),
        suffix,
        include = bundleConfig.include;
    if (bundleName=="alone") {
        suffix = ""
    } else {
        suffix = "-" + bundleName;
    }
    rqConfig.exclude = settings.directDepPkgs.names.filter(function(pkgName){
        
        let isExcluded = true;
        if (bundleName=="alone") {
            isExcluded = true;
        } else {
            if (bundleName=="all") {
                isExcluded = false;
            } else {

                isExcluded = !(include && include.indexOf(pkgName)>-1);
            }
        }
        return isExcluded;
    });

    rqConfig.out = settings.pkg.name + suffix + ".js";

    console.log("bundle " +  bundleName);

    return amdOptimize(rqConfig)
        .on("error",settings.log)
        .pipe(sourceMaps.init())
        .pipe(header(nfs.readFileSync(path.resolve(__dirname, "../fix/allinone-js.header"), 'utf8')))
        .pipe(footer(nfs.readFileSync(path.resolve(__dirname, "../fix/allinone-js.footer"), 'utf8')))
///        .pipe(uglify({
///            mangle: { 
///                reserved: ['require','exports','module']
///           }                
///        }))
        .pipe(header(settings.banner, {
            pkg: settings.pkg
        })) 
        .pipe(sourceMaps.write("sourcemaps"))
        .pipe(gulp.dest(dest)) 
}

module.exports = function(done) {
    return build().then(function(){
        var promises2 = [],
            bundles = settings.bundles || {};

        bundles.alone = true;

        for (let bundleName in bundles) {
            if (bundles[bundleName]) {
                promises2.push(bundle(bundleName,bundles[bundleName]));
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
        ///return Promise.reject(e);
    })

};




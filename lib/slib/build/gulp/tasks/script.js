var path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    sourceMaps = require('gulp-sourcemaps'),
    amdOptimize = require('../../../../helpers/gulp/plugins/scripts/bunch'),
    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    texttojs = require('gulp-texttojs'),
    settings = require('../settings'),
    es6toamd = require('../../../../helpers/parsers/js/es6tosjs'),
    cjstoamd = require('../../../../helpers/parsers/js/cjstosjs'),
    noop = require("gulp-noop"),
    babel = require('gulp-babel'),    
    nfs = require('skynode-nfs');

var srcPkgs = [{
      pkgName : settings.pkg.name,
      pkgSrcJs :   settings.src +  "**/*.js"
    }];

if (settings.prepare && settings.prepare.texttojs){
  srcPkgs[0].pkgSrcTxt = [
      settings.src +  "**/*.{" + settings.prepare.texttojs.join(",") +"}",
      "!" + settings.src +  "**/*.js"
  ];
} 

var dest = settings.dest+"uncompressed/";
console.log("Building package:" + settings.pkg.name);
var requireConfig = {
    baseUrl: dest+settings.pkg.name,
//    out : settings.pkg.name + ".js",
    packages : [{
       name : settings.pkg.name ,
       location :  dest+settings.pkg.name
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
    for (let secondaryPkgName in settings.secondaries) {
        let secondaryPkgSrcDir = path.resolve(settings.prjRoot,settings.secondaries[secondaryPkgName]) + "/",
            secondarySrcPkg = {
                pkgName : secondaryPkgName,
                pkgSrcJs : secondaryPkgSrcDir  +  "**/*.js"
            };

        if (settings.prepare && settings.prepare.texttojs){
          secondarySrcPkg.pkgSrcTxt = [
              secondaryPkgSrcDir +  "**/*.{" + settings.prepare.texttojs.join(",") +"}",
              "!" + secondaryPkgSrcDir +  "**/*.js"
          ];
        } 

        srcPkgs.push(secondarySrcPkg);

        requireConfig.packages.push({
            name : secondaryPkgName,
            location : settings.dest+"uncompressed/"+ secondaryPkgName
        });

        srcPackageNames.push(secondaryPkgName);
    }    
}
Array.prototype.push.apply(requireConfig.packages,settings.rjspkgs.namelocs);

//var include = settings.bundle && settings.bundle.standard && settings.bundle.standard.include;
//requireConfig.exclude = settings.rjspkgs.names.filter(function(name){
//    return !(include && include.indexOf(name)>-1);
//});


function build(){
    var promises = [];
    var moduleCovert = noop;
    if (settings.prepare) {
        if (settings.prepare.es6toamd ) {
            moduleCovert = es6toamd;
        } else if (settings.prepare.cjstoamd) {
            moduleCovert = cjstoamd;
        }

    }
    for (var i =0; i<srcPkgs.length;i++) {
        let srcPkg = srcPkgs[i];

        promises.push( new Promise(function(resolve, reject) {
         gulp.src(srcPkg.pkgSrcJs)
            .on("error",settings.log)
            .on("error", reject)
            .pipe(settings.prepare && settings.prepare.jsxtojs ? babel({
                plugins: [path.join(__dirname, '../../../node_modules/@babel/plugin-transform-react-jsx/lib/index.js')]
             }) : noop())
            .pipe(moduleCovert())
            .pipe(gulp.dest(dest+srcPkg.pkgName))
            .on("end",resolve);
        }) );

        if (srcPkg.pkgSrcTxt) {
            promises.push( new Promise(function(resolve, reject) {
                gulp.src(srcPkg.pkgSrcTxt)
                    .on("error",settings.log)
                    .on("error", reject)
                    .pipe(texttojs())
                    .pipe(gulp.dest(dest+srcPkg.pkgName))
                    .on("end",resolve);
            }) );
        }
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
    rqConfig.optimize = 'none';

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

    rqConfig.out = settings.pkg.name + suffix + ".js",

    console.log("bundle " +  bundleName);

    return amdOptimize(rqConfig)
        .on("error",settings.log)
        .pipe(sourceMaps.init())
        .pipe(header(nfs.readFileSync(path.resolve(__dirname, "../fix/allinone-js.header"), 'utf8')))
        .pipe(footer(nfs.readFileSync(path.resolve(__dirname, "../fix/allinone-js.footer"), 'utf8')))
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
        return Promise.reject(e);
    })

};

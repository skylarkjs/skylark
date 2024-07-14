var path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    gap = require('gulp-append-prepend'),
    sourceMaps = require('gulp-sourcemaps'),
    amdOptimize = require('../gulp/plugins/scripts/bunch'),
    minifer = require('../gulp/plugins/scripts/minify'),

    replace = require('gulp-replace'),
    rename = require("gulp-rename"),
    noop = require("gulp-noop"),
    nfs = require('skynode-nfs');


module.exports = function pack(packages,setting,done) {
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
    for (var srcPkgName in packages) {
        srcPkgs.push({
          pkgName : srcPkgName,
          pkgSrcJs :   src + "/" + srcPkgName +  "/**/*.js"

        });

        requireConfig.packages.push({
            name : srcPkgName,
            location : src+"/"+ srcPkgName
        });
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
        rqConfig.optimize = 'none'


        rqConfig.out = setting.pkg.name + suffix + ".js";

        console.log("out " +  rqConfig.out);
        console.log("bundle " +  bundleName);
        console.log(bundleConfig);

        var prepends = [],
            appends = [];
        if (bundleConfig.concats && bundleConfig.concats.prepends) {
            bundleConfig.concats.prepends.forEach(function(filePath){
                prepends.push(nfs.join(setting.directories.src,filePath))
            });
        }
        if (bundleConfig.concats &&  bundleConfig.concats.appends) {
            bundleConfig.concats.appends.forEach(function(filePath){
                appends.push(nfs.join(setting.directories.src,filePath))
            });
        }

        return amdOptimize(rqConfig)
     //       .on("error",setting.log)
            .pipe(sourceMaps.init())
            .pipe(header(nfs.readFileSync(path.resolve(__dirname, "./fix/allinone-js.header"), 'utf8')))
            .pipe(footer(nfs.readFileSync(path.resolve(__dirname, "./fix/allinone-js.footer"), 'utf8')))
            
            .pipe(
                process.env.NODE_ENV === 'development' ?  noop() :
                  minifer()
                  ///uglify({
                  ///  mangle: { 
                  ///      reserved: ['require','exports','module']
                  ///  }                
                  ///})
            )
            .pipe(gap.prependFile(prepends))
            .pipe(gap.appendFile(appends))
            .pipe(header(setting.banner, {
                pkg: setting.pkg
            })) 
            .pipe(sourceMaps.write("sourcemaps"))
            .pipe(gulp.dest(dest)) 
    }

    return build().then(function(){
        var promises2 = [],
            bundles =  slaxJson.scripts &&  slaxJson.scripts.bundles || {}; // slaxJson.pages || slaxJson.apps || [];


        for (var name in bundles) {
            promises2.push(bundle(name,bundles[name]));
           
        }

        return Promise.all(promises2).then(function(){
            done();
        }).catch(function(e){
            console.error(e);
            return Promise.reject(e);
        });
    },function(e){
        console.error(e);
        done(e);
    })

};



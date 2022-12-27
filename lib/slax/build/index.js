const path = require('path');
const GulpRunner = require('../../helpers/gulp/runner');


exports = module.exports = build;


function build(slaxAppRoot) {
/*    
    const root = path.resolve(slaxAppRoot);
    const pkg = require(path.join(root, "package.json"));
    const appname = pkg.slax && pkg.slax.appname || pkg.name;

    const dist = path.join(root, "dist");
    const src = path.join(root, "src");
    const lib = path.join(root, "lib");
    const buildGulp = path.join(root, "build", "gulpfile.js");
    const deploy = path.join(root, "deploy", appname + ".slax");

    if (fs.existsSync(dist)) {
        del.sync([dist + '\**\*'], {
            force: true
        });
    }

    // if (fs.existsSync(buildGulp)) {
    // } else {
    console.log(src + ":" + dist);
    copydir.sync(src, dist);
    copydir.sync(lib, path.join(dist, "lib"));
    // }
*/

      var options = {
        prjRoot : slaxAppRoot
      };

    var gulp = new GulpRunner(path.resolve(__dirname,'./gulpfile.js'));
    gulp.on('start', function() {
      console.log('gulp starting...')
    })

    gulp.on('complete', function() {
      console.log('complete!')
    });

    gulp.on('log', function(data) {
      // console.log(data.toString())
      // works better to 
      process.stdout.write(data);
    });

    gulp.on('error', function(err) {
      process.stderr.write(err);
    });

    return gulp.run('default',options);
}
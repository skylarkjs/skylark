const path = require('path');
const GulpRunner = require('gulp-runner');

exports = module.exports = build;


function build(prjRoot) {
    var options = {
      prjRoot : prjRoot
    };
    console.log("The bundle prject root directory:"+path.resolve(process.cwd(),prjRoot));

    var GulpRunner = require('gulp-runner');

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

    gulp.run('default',options);
}
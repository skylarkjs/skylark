const path = require('path');
const del = require('del');
const copy = require('copy-dir');
const fs = require('fs');

exports = module.exports = build;


function build(slaxAppRoot) {
	const root = path.resolve(slaxAppRoot);
	const pkg = require(path.join(root,"package.json"));
	const appname = pkg.slax && pkg.slax.appname || pkg.name;

	const dist = path.join(root,"dist");
	const src = path.join(root,"src");
	const buildGulp =  path.join(root,"build","gulpfile.js");
	const deploy = path.join(root,"deploy",appname+".slax");


    if (fs.existsSync(dist)) {
        del.sync([dist + '/**/*'], {
            force: true
        });       
    }

    if (fs.existsSync(buildGulp)) {
    } else {
    	copydir.sync(src, dist);
    }

}
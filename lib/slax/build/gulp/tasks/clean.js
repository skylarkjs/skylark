var gulp = require('gulp'),
    setting = require('../settings'),
    nfs = require('skynode-nfs');


module.exports = function(done) {
    console.log('Clean folder:', setting.directories.obj);
	nfs.removeSync(setting.directories.obj);
    console.log('Clean folder:', setting.directories.dist);
	//nfs.removeSync(setting.directories.dist);
	//nfs.rmdirSync(setting.directories.dist);
	nfs.rimraf.sync(setting.directories.dist);

	done();
};

var gulp = require('gulp'),
    settings = require('../settings'),
    nfs = require('skynode-nfs');


module.exports = function(done) {
    console.log('Clean folder:', settings.dest);
	//nfs.removeSync(setting.dest);
	//nfs.rmdirSync(setting.dest);
	nfs.rimraf.sync(dest);
	done();
};

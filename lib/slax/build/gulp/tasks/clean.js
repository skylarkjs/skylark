var gulp = require('gulp'),
    setting = require('../settings'),
    nfs = require('skynode-nfs');


module.exports = function() {
    console.log('Clean folder:', setting.directories.obj);
	nfs.removeSync(setting.directories.obj);
    console.log('Clean folder:', setting.directories.dist);
	nfs.removeSync(setting.directories.dist);
};

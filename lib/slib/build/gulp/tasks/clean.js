var gulp = require('gulp'),
    settings = require('../settings'),
    nfs = require('skynode-nfs');


module.exports = function(done) {
    console.log('Clean folder:', settings.dest);
	nfs.removeSync(settings.dest);
	done();
};

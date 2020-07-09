var gulp = require('gulp');
var runSequence = require('run-sequence');


module.exports = function(callback) {
	return runSequence(
    	'clean',
    	'script',
    	'minify',
     	'script-core',
    	'minify-core',
    	callback
  	);
};

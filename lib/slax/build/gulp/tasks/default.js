var gulp = require('gulp');
var runSequence = require('gulp4-run-sequence');


module.exports = function(callback) {
	return runSequence(
    	'clean',
    	'compile',
    	'pack',
    	callback
  	);
};

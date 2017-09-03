var gulp = require('gulp'),
    util = require('../utils'),
    del = require('del');


module.exports = function() {
    del.sync([util.dest + '/**/*', '!' + util.dest + "/"], {
        force: true
    });
    console.log('Clean folder:\n', util.dest);
};

const Es6Module = require('./es6module');
const through2 = require('through2');
const PluginError = require('plugin-error');

module.exports = function (options) {
    options = options || {};
    return through2.obj(function (file, encoding, callback) {
        var data;
        if (file.isNull()) { return callback(null, file); }
        if (file.isStream()) {
            return callback(new PluginError('gulp-es6-to-amd', 'Streaming not supported'));
        }
        try {
            data = file.contents.toString('utf8');
            file.contents = new Buffer(Es6Module.converter(data));
            this.push(file);
        } catch (err) {
            if (!options.silent) {
                console.error(err);
                err.message = err.message ? `${err.message} in ${file.path}` : 'Unknown error';
                console.log(err.message);
                this.emit('error', new PluginError('gulp-es6-to-amd', err, {
                    fileName: file.path,
                    showProperties: false
                }));
            }
        }

        callback();
    });
};
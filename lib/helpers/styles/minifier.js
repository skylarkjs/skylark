'use strict';

var os = require('os');
var async = require('async');
var less = require('less');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var clean = require('./postcss/clean');
var nfs = require('skynode-nfs');

var fork = require('./debugFork');


var Minifier = module.exports;

var pool = [];
var free = [];

var maxThreads = 0;

Object.defineProperty(Minifier, 'maxThreads', {
	get: function () {
		return maxThreads;
	},
	set: function (val) {
		maxThreads = val;
		if (!process.env.minifier_child) {
			console.log('[minifier] utilizing a maximum of ' + maxThreads + ' additional threads');
		}
	},
	configurable: true,
	enumerable: true,
});

Minifier.maxThreads = 0; /// os.cpus().length - 1;

Minifier.killAll = function () {
	pool.forEach(function (child) {
		child.kill('SIGTERM');
	});

	pool.length = 0;
	free.length = 0;
};

function getChild() {
	if (free.length) {
		return free.shift();
	}

	var proc = fork(__filename, [], {
		cwd: __dirname,
		env: {
			minifier_child: true,
		},
	});
	pool.push(proc);

	return proc;
}

function freeChild(proc) {
	proc.removeAllListeners();
	free.push(proc);
}

function removeChild(proc) {
	var i = pool.indexOf(proc);
	if (i !== -1) {
		pool.splice(i, 1);
	}
}

function forkAction(action, callback) {
	var proc = getChild();

	proc.on('message', function (message) {
		freeChild(proc);

		if (message.type === 'error') {
			return callback(message.message);
		}

		if (message.type === 'end') {
			callback(null, message.result);
		}
	});
	proc.on('error', function (err) {
		proc.kill();
		removeChild(proc);
		callback(err);
	});

	proc.send({
		type: 'action',
		action: action,
	});
}

var actions = {};

if (process.env.minifier_child) {
	process.on('message', function (message) {
		if (message.type === 'action') {
			var action = message.action;
			if (typeof actions[action.act] !== 'function') {
				process.send({
					type: 'error',
					message: 'Unknown action',
				});
				return;
			}

			actions[action.act](action, function (err, result) {
				if (err) {
					process.send({
						type: 'error',
						message: err.stack || err.message || 'unknown error',
					});
					return;
				}

				process.send({
					type: 'end',
					result: result,
				});
			});
		}
	});
}

function executeAction(action, fork, callback) {
	if (fork && (pool.length - free.length) < Minifier.maxThreads) {
		forkAction(action, callback);
	} else {
		if (typeof actions[action.act] !== 'function') {
			return callback(Error('Unknown action'));
		}
		actions[action.act](action, callback);
	}
}

function concat(data, callback) {
	if (data.files && data.files.length) {
		async.mapLimit(data.files, 1000, function (ref, next) {
			nfs.readFile(ref.srcPath, 'utf8', function (err, file) {
				if (err) {
					return next(err);
				}

				next(null, file);
			});
		}, function (err, files) {
			if (err) {
				return callback(err);
			}

			var output = files.join('\n;');
			nfs.writeFile(data.destPath, output, callback);
		});

		return;
	}

	callback();
}
actions.concat = concat;

function buildCSS(data, callback) {
	less.render(data.source, {
		paths: data.paths,
		javascriptEnabled: true
	}, function (err, lessOutput) {
		if (err) {
			return callback(err);
		}

		postcss(data.minify ? [
			autoprefixer,
			clean({
				processImportFrom: ['local'],
			}),
		] : [autoprefixer]).process(lessOutput.css, {
			from: undefined,
		}).then(function (result) {
			process.nextTick(callback, null, { code: result.css });
		}).catch(function (err) {
			process.nextTick(callback, err);
		});
	});
}
actions.buildCSS = buildCSS;

Minifier.bundle = function (source, paths, minify, fork, callback) {
	console.log("css.bundle.paths:");
	console.dir(paths);
	executeAction({
		act: 'buildCSS',
		source: source,
		paths: paths,
		minify: minify,
	}, fork, callback);
};

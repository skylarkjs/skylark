'use strict';

///var mkdirp = require('mkdirp');
var nfs = require('skynode-nfs');
var mkdirp = nfs.mkdir;

///var rimraf = require('rimraf');
var async = require('async');
var Benchpress = require('benchpressjs');

///views_dir: nfs.join(dirname, 'build/public/templates'),
///var viewsPath = nconf.get('views_dir');
///var viewsPath = nfs.join(nconf.get("base_dir"), nconf.get("system:build:templates:output"));

var Templates = module.exports;

function processImports(paths, templatePath, source, callback) {
	var regex = /<!-- IMPORT (.+?) -->/;

	var matches = source.match(regex);

	if (!matches) {
		return callback(null, source);
	}

	var partial = matches[1];
	if (paths[partial] && templatePath !== partial) {
		nfs.readFile(paths[partial], 'utf8', function (err, partialSource) {
			if (err) {
				return callback(err);
			}

			source = source.replace(regex, partialSource);
			processImports(paths, templatePath, source, callback);
		});
	} else {
		console.warn('[meta/templates] Partial not loaded: ' + matches[1]);
		source = source.replace(regex, '');

		processImports(paths, templatePath, source, callback);
	}
}
Templates.processImports = processImports;

function getTemplateDirs(coreTemplatesPath,callback) {

	////nconf.set('core_templates_path', nfs.join(dirname, 'slax/src/templates'));
	///var coreTemplatesPath = nconf.get('core_templates_path');
	///if (!coreTemplatesPath) {
	///	coreTemplatesPath = nfs.join(nconf.get('base_dir'),'slax/src/templates');		
	///}
	///var coreTemplatesPath = nfs.join(nconf.get('base_dir'),nconf.get('system:build:templates:source'));


	///var templateDirs = _.uniq([coreTemplatesPath].concat(themeTemplates, pluginTemplates));
	var templateDirs = [coreTemplatesPath];

	async.filter(templateDirs, nfs.exists, callback);
}

function getTemplateFiles(dirs, callback) {
	async.waterfall([
		function (cb) {
			async.map(dirs, function (dir, next) {
				nfs.walk(dir, function (err, files) {
					if (err) { return next(err); }

					files = files.filter(function (path) {
						return path.endsWith('.tpl');
					}).map(function (file) {
						return {
							name: nfs.relative(dir, file).replace(/\\/g, '/'),
							path: file,
						};
					});
					next(null, files);
				});
			}, cb);
		},
		function (buckets, cb) {
			var dict = {};
			buckets.forEach(function (files) {
				files.forEach(function (file) {
					dict[file.name] = file.path;
				});
			});

			cb(null, dict);
		},
	], callback);
}

function compileTemplate(viewsPath,filename, source, callback) {
	var _ = require('lodash');
	
	async.waterfall([
		function (next) {
			nfs.walk(viewsPath, next);
		},
		function (paths, next) {
			paths = _.fromPairs(paths.map(function (p) {
				var relative = nfs.relative(viewsPath, p).replace(/\\/g, '/');
				return [relative, p];
			}));
			async.waterfall([
				function (next) {
					processImports(paths, filename, source, next);
				},
				function (source, next) {
					Benchpress.precompile(source, {
						minify: global.env !== 'development',
					}, next);
				},
				function (compiled, next) {
					nfs.writeFile(nfs.join(viewsPath, filename.replace(/\.tpl$/, '.js')), compiled, next);
				},
			], next);
		},
	], callback);
}
Templates.compileTemplate = compileTemplate;

function compile(coreTemplatesPath,viewsPath,callback) {
	callback = callback || function () {};

	async.waterfall([
		function (next) {
			nfs.rimraf(viewsPath, function (err) { next(err); });
		},
		function (next) {
			mkdirp(viewsPath, function (err) { next(err); });
		},
		function(next) {
			getTemplateDirs(coreTemplatesPath,next);
		},
		getTemplateFiles,
		function (files, next) {
			async.each(Object.keys(files), function (name, next) {
				var filePath = files[name];

				async.waterfall([
					function (next) {
						nfs.readFile(filePath, 'utf8', next);
					},
					function (source, next) {
						processImports(files, name, source, next);
					},
					function (source, next) {
						mkdirp(nfs.join(viewsPath, nfs.dirname(name)), function (err) {
							next(err, source);
						});
					},
					function (imported, next) {
						async.parallel([
							function (cb) {
								nfs.writeFile(nfs.join(viewsPath, name), imported, cb);
							},
							function (cb) {
								Benchpress.precompile(imported, { minify: global.env !== 'development' }, function (err, compiled) {
									if (err) {
										cb(err);
										return;
									}

									nfs.writeFile(nfs.join(viewsPath, name.replace(/\.tpl$/, '.js')), compiled, cb);
								});
							},
						], next);
					},
				], next);
			}, next);
		},
		function (next) {
			console.log('[meta/templates] Successfully compiled templates.');
			next();
		},
	], callback);
}
Templates.compile = compile;

'use strict';

///var mkdirp = require('mkdirp');
var nfs = require('skynode-nfs');
var mkdirp = nfs.mkdir;

///var rimraf = require('rimraf');
var winston = require('winston');
var async = require('async');
var nconf = system.require('skynode-basis/system/parameters');
var _ = require('lodash');
var Benchpress = require('benchpressjs');

var plugins = system.require('skynode-basis/plugins');
var db = system.require('skynode-basis/database');


///views_dir: nfs.join(dirname, 'build/public/templates'),
///var viewsPath = nconf.get('views_dir');
var viewsPath = nfs.join(nconf.get("base_dir"), nconf.get("system:build:templates:output"));

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
		winston.warn('[meta/templates] Partial not loaded: ' + matches[1]);
		source = source.replace(regex, '');

		processImports(paths, templatePath, source, callback);
	}
}
Templates.processImports = processImports;

///var themeNamePattern = /^(@.*?\/)?(nodebb|skybb)-theme-.*$/;//modified by lwf
var themeNamePattern = new RegExp(nconf.get("themes:themeNamePattern"));

function getTemplateDirs(activePlugins, callback) {
	console.log("base_dir:" + nconf.get('base_dir'));
	var pluginTemplates = activePlugins.map(function (id) {
		if (themeNamePattern.test(id)) {
			////return nconf.get('theme_templates_path');
			return nconf.get('theme_templates_path');
		}
		if (!plugins.pluginsData[id]) {
			return '';
		}

		//return nfs.join(__dirname, '../../node_modules/', id, plugins.pluginsData[id].templates || 'templates');
		return nfs.join(nconf.get('base_dir'), 'node_modules/', id, plugins.pluginsData[id].templates || 'templates');
	}).filter(Boolean);

	var themeConfig = require(nconf.get('theme_config'));
	var theme = themeConfig.baseTheme;

	var themePath;
	var themeTemplates = [];
	while (theme) {
		////themes_path: nfs.join(dirname, 'node_modules'),
		///themePath = nfs.join(nconf.get('themes_path'), theme);
		themePath = nfs.join(nconf.get('base_dir'), 'node_modules',theme);
		themeConfig = require(nfs.join(themePath, 'theme.json'));

		themeTemplates.push(nfs.join(themePath, themeConfig.templates || 'templates'));
		theme = themeConfig.baseTheme;
	}

	////themeTemplates.push(nconf.get('base_templates_path'));
	themeTemplates = _.uniq(themeTemplates.reverse());

	////nconf.set('core_templates_path', nfs.join(dirname, 'slax/src/templates'));
	///var coreTemplatesPath = nconf.get('core_templates_path');
	///if (!coreTemplatesPath) {
	///	coreTemplatesPath = nfs.join(nconf.get('base_dir'),'slax/src/templates');		
	///}
	var coreTemplatesPath = nfs.join(nconf.get('base_dir'),nconf.get('system:build:templates:source'));


	///var templateDirs = _.uniq([coreTemplatesPath].concat(themeTemplates, pluginTemplates));
	var templateDirs = _.uniq([coreTemplatesPath].concat(pluginTemplates));

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

function compileTemplate(filename, source, callback) {
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

function compile(callback) {
	callback = callback || function () {};

	async.waterfall([
		function (next) {
			nfs.rimraf(viewsPath, function (err) { next(err); });
		},
		function (next) {
			mkdirp(viewsPath, function (err) { next(err); });
		},
		function (next) {
			db.getSortedSetRange('plugins:active', 0, -1, next);
		},
		getTemplateDirs,
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
			winston.verbose('[meta/templates] Successfully compiled templates.');
			next();
		},
	], callback);
}
Templates.compile = compile;

'use strict';

var async = require('async');
///var mkdirp = require('mkdirp');
var nfs = require('skynode-nfs');
var mkdirp = nfs.mkdir;

///var rimraf = require('rimraf');

///var nconf = system.require('skynode-basis/system/parameters');
///var buildLanguagesPath = nfs.join(nconf.get('base_dir'), 'build/public/language');
///var coreLanguagesPath = nfs.join(nconf.get('base_dir'), 'slax/src/languages');

function sort_unique(arr) {
    return arr.sort().filter(function(el,i,a) {
        return (i==a.indexOf(el));
    });
}

function getTranslationMetadata(coreLanguagesPath,buildLanguagesPath,callback) {
	async.waterfall([
		// generate list of languages and namespaces
		function (next) {
			nfs.walk(coreLanguagesPath, next);
		},
		function (paths, next) {
			var languages = [];
			var namespaces = [];

			paths.forEach(function (p) {
				if (!p.endsWith('.json')) {
					return;
				}

				var rel = nfs.relative(coreLanguagesPath, p).split(/[/\\]/);
				var language = rel.shift().replace('_', '-').replace('@', '-x-');
				var namespace = rel.join('/').replace(/\.json$/, '');

				if (!language || !namespace) {
					return;
				}

				languages.push(language);
				namespaces.push(namespace);
			});

			next(null, {
				languages : sort_unique(languages),
				namespaces : sort_unique(namespaces)
			});
		},

		// save a list of languages to `${buildLanguagesPath}/metadata.json`
		// avoids readdirs later on
		function (ref, next) {
			async.series([
				function (next) {
					mkdirp(buildLanguagesPath, next);
				},
				function (next) {
					nfs.writeFile(nfs.join(buildLanguagesPath, 'metadata.json'), JSON.stringify({
						languages: ref.languages,
						namespaces: ref.namespaces,
					}), next);
				},
			], function (err) {
				next(err, ref);
			});
		},
	], callback);
}

function writeLanguageFile(buildLanguagesPath,language, namespace, translations, callback) {
	var dev = global.env === 'development';
	var filePath = nfs.join(buildLanguagesPath, language, namespace + '.json');

	async.series([
		async.apply(mkdirp, nfs.dirname(filePath)),
		async.apply(nfs.writeFile, filePath, JSON.stringify(translations, null, dev ? 2 : 0)),
	], callback);
}

// for each language and namespace combination,
// run through core and all plugins to generate
// a full translation hash
function buildTranslations(coreLanguagesPath,buildLanguagesPath,ref, next) {
	var namespaces = ref.namespaces;
	var languages = ref.languages;

	async.each(namespaces, function (namespace, next) {
		async.each(languages, function (lang, next) {
			var translations = {};

			nfs.readFile(nfs.join(coreLanguagesPath, lang, namespace + '.json'), 'utf8', function (err, file) {
				if (err) {
					if (err.code === 'ENOENT') {
						return next();
					}
					return next(err);
				}

				try {
					Object.assign(translations, JSON.parse(file));

					if (Object.keys(translations).length) {
						writeLanguageFile(buildLanguagesPath,lang, namespace, translations, next);
					} else {
						next();
					}
				} catch (err) {
					next(err);
				}
			});
		}, next);
	}, next);
}

exports.build = function buildLanguages(coreLanguagesPath,buildLanguagesPath,callback) {
	async.waterfall([
		function (next) {
			nfs.rimraf(buildLanguagesPath, next);
		},
		function(next) {
			getTranslationMetadata(coreLanguagesPath,buildLanguagesPath,next);
		},
		function(ref,next) {
			buildTranslations(coreLanguagesPath,buildLanguagesPath,ref,next);
		}
	], callback);
};

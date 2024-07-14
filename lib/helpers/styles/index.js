'use strict';


var nfs = require('skynode-nfs');

var async = require('async');

var minifier = require('./minifier');

var CSS = module.exports;


CSS.build = function (bundles,settings, done) {
    var outputDir = nfs.join(settings.directories.obj, './styles');

    var coreStylesPath = nfs.join(settings.directories.src, './styles');
    var paths = [
        nfs.join(settings.prjRoot,"node_modules"),
        coreStylesPath
    ];
	function buildOne(target,files) {
		return new Promise(function(resolve, reject) {
			async.waterfall([
				///function (next) {
				///	if (target === 'client') {
				///		//rimraf(nfs.join(__dirname, '../../build/public/client*'), next);
				///		nfs.rimraf(nfs.join(nconf.get('base_dir'), 'build/public/client*'), next);
				///	} else {
				///		setImmediate(next);
				///	}
				///},
				function (next) {
					nfs.mkdir(outputDir, function (err) { next(err); });
				},
				function (next) {
					var minify = global.env !== 'development';
					minifier.bundle(
						files.map(function (str) {
							return str.replace(/\//g, nfs.sep);
						}).join("\n"), 
						paths, 
						minify, 
						false, 
						next
					);
				},
				function (bundle, next) {
					var filename = target + '.css';

					//nfs.writeFile(nfs.join(__dirname, '../../build/public', filename), bundle.code, function (err) {
					nfs.writeFile(nfs.join(outputDir, filename), bundle.code, function (err) {
						next(err, bundle.code);
					});
				},
			], function(err) {
				if (err) { 
					reject(err)
				} else {
					resolve();
				}
			});
		});

	}

	function buildAll() {
        var promises = [];

        for (var name in bundles) {
        	promises.push(buildOne(name,bundles[name].files));
        }
        return Promise.all(promises);
	}

    return buildAll().then(function(){
        done();
    }).catch(function(err){
        done(err);
    });	
};

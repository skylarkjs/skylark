var async = require('async'),
    languages = require('../../../../helpers/languages'),
    scripts = require('../../../../helpers/scripts'),
    templates = require('../../../../helpers/templates'),
    styles = require('../../../../helpers/styles'),
    settings = require('../settings'),
    nfs = require('skynode-nfs');


module.exports = function(done) {

    async.waterfall([
        function (next) {
            console.log("Compiling scripts");

            scripts.compile(settings.slaxJson.scripts.packages,settings, next);
        },
        function(next) {
            console.log("Compiling languages");
            var buildLanguagesPath = nfs.join(settings.directories.obj, './languages');
            var coreLanguagesPath = nfs.join(settings.directories.src, './languages');
            languages.build(coreLanguagesPath,buildLanguagesPath,next);
        },
        function(next) {
            console.log("Compiling templates");
            var viewsPath = nfs.join(settings.directories.obj, './templates');
            var coreTemplatesPath = nfs.join(settings.directories.src, './templates');
            templates.compile(coreTemplatesPath,viewsPath,next);
        },
        function(next) {
            console.log("Compiling styles");
            styles.build(settings.slaxJson.styles.bundles,settings, next);
        },
        
        function(next) {
            console.log("Copying resources");
            console.log( nfs.join(settings.directories.src, './resources'));
            console.log( nfs.join(settings.directories.obj, './resources'));

            nfs.copy(
                nfs.join(settings.directories.src, './resources'),
                nfs.join(settings.directories.obj, './resources'),
                next
            );
        },
        
        function(next) {
            console.log("Copy slax.json");
            nfs.copyFile(
                nfs.join(settings.directories.src, './slax.json'),
                nfs.join(settings.directories.obj, './slax.json'),
                next
            )
        }
    ], done);
};

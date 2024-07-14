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
            console.log("Packing scripts");

            scripts.pack(settings.slaxJson.scripts.packages,settings, next);
        },
        function(next) {
            console.log("Packing languages");
            nfs.copy(
                nfs.join(settings.directories.obj, './languages'),
                nfs.join(settings.directories.dist, './languages'),
                next
            );
        },
        function(next) {
            console.log("Packing templates");
            nfs.copy(
                nfs.join(settings.directories.obj, './templates'),
                nfs.join(settings.directories.dist, './templates'),
                next
            );
        },
        function(next) {
            console.log("Packing styles");
            nfs.copy(
                nfs.join(settings.directories.obj, './styles'),
                nfs.join(settings.directories.dist, './styles'),
                next
            );
        },
        function(next) {
            console.log("Packing resources");
            nfs.copy(
                nfs.join(settings.directories.obj, './resources'),
                nfs.join(settings.directories.dist, './resources'),
                next
            );
        },
        function(next) {
            console.log("Packing slax.json");
            nfs.copyFile(
                nfs.join(settings.directories.obj, './slax.json'),
                nfs.join(settings.directories.dist, './slax.json'),
                next
            )
        }
    ], done);
};

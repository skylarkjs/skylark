const archiver = require('./archiver');
const path = require('path');

exports = module.exports = deploy;


function deploy(slaxPrjRoot) {
    const root = path.resolve(slaxPrjRoot);
    const pkg = require(path.join(root, "package.json"));
    const appname = pkg.slax && pkg.slax.appname || pkg.name;

    const dist = path.join(root, "dist");
    const deploy = path.join(root, "deploy", appname + ".slax");

    archiver.pack(dist, deploy, function(err) {
        if (err) {
            console.error(error.stack)
            process.exit(1)
        }
    });
}

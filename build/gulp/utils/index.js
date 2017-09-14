var gutil = require('gulp-util');


var pkg = require('../../../package.json');
var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

module.exports = {
    src: '../src/',
    dest: '../dist/',
    lib: '../lib/',
    banner: banner,
    allinoneHeader : './scripts/allinone-js.header',
    allinoneFooter : './scripts/allinone-js.footer',
    pkg: pkg
};

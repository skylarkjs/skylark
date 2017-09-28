var gutil = require('gulp-util');


var pkg = require('../../../../package.json');
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
    lib_langx: '../../node_modules/skylark-langx/dist/',
    lib_router: '../../node_modules/skylark-router/dist/',
    lib_spa: '../../node_modules/skylark-spa/dist/',
    lib_utils: '../../node_modules/skylark-utils/dist/',
    banner: banner,
    allinoneHeader : './scripts/allinone-js.header',
    allinoneFooter : './scripts/allinone-js.footer',
    pkg: pkg
};

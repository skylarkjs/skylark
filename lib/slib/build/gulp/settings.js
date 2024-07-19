var gutil = require('gulp-util'),
    path = require('path'),
    log = require('fancy-log'),

    fs = require('fs'),
    argv = require('yargs').argv,
    prjRoot = argv.prjRoot; 

var pkg = require(path.resolve(prjRoot,'./package.json')),
    skylarkjs = pkg.skylarkjs || {},
    directories = skylarkjs && skylarkjs.directories ,
    dirDependencies = directories && directories.dependencies,

    internalDependencies = skylarkjs && skylarkjs.internalDependencies,

    build = skylarkjs && skylarkjs.build,
    prepare = build && build.prepare,
    bundles = build && build.bundles,
    secondaries = skylarkjs && skylarkjs.secondaries,
    rjspkgs = {
        names : [],
        namelocs : []
    },
    directDepPkgs = {
        names : [],
        namelocs : []        
    };

console.log("directly dependencied packages:")


var pkgDependencies = pkg.dependencies;
if (pkgDependencies) {
    for (var name in pkgDependencies) {
        directDepPkgs.names.push(name);
        directDepPkgs.namelocs.push({
            name : name,
            location : path.resolve(prjRoot,"./node_modules",name,"./dist/uncompressed/",name)+'/'
        });
        console.log(name+":" + path.resolve(prjRoot,"./node_modules",name,"./dist/uncompressed/",name)+'/');
    }
}


///console.log("The packages dependencied:")
var dependenciesRoot = path.resolve(prjRoot,dirDependencies || "./node_modules"),
    dependencies =  fs.readdirSync(dependenciesRoot);
for (var i = 0; i < dependencies.length;i++) {
    var name = dependencies[i];
    if(name.match(/^[A-Za-z]/i) && name !=pkg.name) {
        rjspkgs.names.push(name);
        rjspkgs.namelocs.push({
            name : name,
            location : path.resolve(dependenciesRoot,name,"./dist/uncompressed/",name)+'/'
        });
        ///console.log(name+":" + path.resolve(dependenciesRoot,name,"./dist/uncompressed/",name)+'/');        
    }
}

if (internalDependencies) {
    console.log("The packages dependencied internally:")
    for (let pkgName in internalDependencies) {
        let pkgDir = path.resolve(prjRoot,internalDependencies[pkgName],"./dist/uncompressed/",pkgName)+ "/"
        rjspkgs.names.push(pkgName);
        rjspkgs.namelocs.push({
            name : pkgName,
            location : pkgDir 
        });
        console.log(pkgName+":" + pkgDir);        
    }
}

/*
if (secondaries) {
    console.log("secondary packages:")
    for (var name in secondaries) {
        rjspkgs.names.push(name);
        rjspkgs.namelocs.push({
            name : name,
            location : path.resolve(prjRoot,secondaries[name]) + "/" 
        });
        console.log(name+":" + path.resolve(prjRoot,secondaries[name])+ "/");        
    }
}
*/

const { lstatSync, readdirSync } = require('fs')

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source => fs.
readdirSync(source).map(name => join(source, name)).filter(isDirectory)


var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @author <%= pkg.author %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

var initOnLoadScript = [
    'try {',
    '    require("<%= pkg.name %>");',
    '} catch(e) {',
    '    console.error("please use skylark-requirejs");',
    '}'
].join('\n');

module.exports = {
    prjRoot : prjRoot,
    src: path.resolve(prjRoot,'./src') + '/',
    dest: path.resolve(prjRoot,'./dist') + '/',
    banner: banner,
    initOnLoadScript:initOnLoadScript,
    allinoneHeader : path.resolve(__dirname ,'../../scripts/allinone-js.header'),
    allinoneFooter : path.resolve(__dirname ,'../../scripts/allinone-js.footer'),
    pkg: pkg,
    log : log,
    rjspkgs : rjspkgs,
    directDepPkgs : directDepPkgs,
    prepare,
    bundles,
    secondaries
};

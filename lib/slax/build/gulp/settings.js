var gutil = require('gulp-util'),
    path = require('path'),
    log = require('fancy-log'),

    nfs = require('skynode-nfs'),
    argv = require('yargs').argv,
    prjRoot = argv.prjRoot; 

var pkg = require(path.resolve(prjRoot,'./package.json')),
    skylarkjs = pkg.skylarkjs || {},
    directories = skylarkjs && skylarkjs.directories ,
    dirDependencies = directories && directories.dependencies,
    dirSrc = directories && directories.src || "./src",
    dirObj = directories && directories.obj || "./obj",
    dirDist = directories && directories.dist || "./dist",

    internalDependencies = skylarkjs && skylarkjs.internalDependencies,

    build = skylarkjs && skylarkjs.build,
    prepare = build && build.prepare,
    bundles = build && build.bundles,
    secondaries = skylarkjs && skylarkjs.secondaries,
    rjspkgs = {
        names : [],
        namelocs : []
    };

console.log("dependencied packages:")


/*
var devDependencies = pkg.devDependencies;
if (devDependencies) {
    for (var name in devDependencies) {
        rjspkgs.names.push(name);
        rjspkgs.namelocs.push({
            name : name,
            location : path.resolve(prjRoot,"./node_modules",name,"./dist/uncompressed/",name)+'/'
        });
        console.log(name+":" + path.resolve(prjRoot,"./node_modules",name,"./dist/uncompressed/",name)+'/');
    }
}
*/
console.log("The packages dependencied:")
var dependenciesRoot = path.resolve(prjRoot,dirDependencies || "./node_modules"),
    dependencies =  nfs.readdirSync(dependenciesRoot);
for (var i = 0; i < dependencies.length;i++) {
    var name = dependencies[i];
    if(name.match(/^[A-Za-z]/i)) {
        rjspkgs.names.push(name);
        rjspkgs.namelocs.push({
            name : name,
            location : path.resolve(dependenciesRoot,name,"./dist/uncompressed/",name)+'/'
        });
        console.log(name+":" + path.resolve(dependenciesRoot,name,"./dist/uncompressed/",name)+'/');        
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

/*
const { lstatSync, readdirSync } = require('fs')

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source => fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)
*/


const slaxJson = nfs.readJsonSync(path.join(prjRoot,dirSrc, "slax.json"));

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
    directories : {
        src: path.resolve(prjRoot,dirSrc) + '/',
        obj: path.resolve(prjRoot,dirObj) + '/',
        dist: path.resolve(prjRoot,dirDist) + '/'
    },
    banner: banner,
    initOnLoadScript:initOnLoadScript,
    allinoneHeader : path.resolve(__dirname ,'../../scripts/allinone-js.header'),
    allinoneFooter : path.resolve(__dirname ,'../../scripts/allinone-js.footer'),
    pkg: pkg,
    log : log,
    rjspkgs : rjspkgs,
    prepare,
    bundles,
    secondaries,
    slaxJson
};

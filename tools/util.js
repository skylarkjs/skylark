const ejs = require('ejs');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rmdirp = require('rmdir');
const path = require('path');

var MODE_0666 = parseInt('0666', 8);
var MODE_0755 = parseInt('0755', 8);

exports = module.exports = {
  "emptyDirectory" : emptyDirectory,
  "copyFile" : copyFile,
  "mkdir" : mkdir,
  "rmdir" : rmdir,
  "write" : write,
  "read" : read
};



/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory (path, fn) {
  fs.readdir(path, function (err, files) {
    if (err && err.code !== 'ENOENT') throw err
    fn(!files || !files.length)
  })
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir (path, fn) {
  mkdirp(path, MODE_0755, function (err) {
    if (err) throw err
    console.log('   \x1b[36mcreate\x1b[0m : ' + path)
    fn && fn()
  })
}

function rmdir (path, fn) {
  rmdirp(path, function (err) {
    if (err) throw err
    console.log('   \x1b[36mdelete\x1b[0m : ' + path)
    fn && fn()
  })
}

function copyFile (file, from,to){
  //gets file name and adds it to dir2
  var source = fs.createReadStream(path.join(from,file));
  var dest = fs.createWriteStream(path.join(to, file));

  source.pipe(dest);
};


/**
 * Generate a callback function for commander to warn about renamed option.
 *
 * @param {String} originalName
 * @param {String} newName
 */

function renamedOption (originalName, newName) {
  return function (val) {
    warning(util.format("option `%s' has been renamed to `%s'", originalName, newName))
    return val
  }
}

/**
 * Display a warning similar to how errors are displayed by commander.
 *
 * @param {String} message
 */

function warning (message) {
  console.error()
  message.split('\n').forEach(function (line) {
    console.error('  warning: %s', line)
  })
  console.error()
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write (path, str, mode) {
  fs.writeFileSync(path, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + path)
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}
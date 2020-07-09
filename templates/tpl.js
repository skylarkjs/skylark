const ejs = require('ejs');
const nfs = require('skynode-nfs');
const mkdirp = require('mkdirp');
const rmdirp = require('rmdir');
const path = require('path');
//const util = require('../util');

exports = module.exports = {
	"copyTemplate" : copyTemplate,
	"createAppName" : createAppName,
  "loadTemplate": loadTemplate
 };


/**
 * Copy file from template directory.
 */

function copyTemplate (from, to) {
  from = path.join(__dirname, 'templates', from);
  //util.write(to, fs.readFileSync(from, 'utf-8'));
  nfs.copySync(from,to);
}

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */

function createAppName (pathName) {
  return path.basename(pathName)
    .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase()
}

/**
 * Load template file.
 */

function loadTemplate (name) {
  var contents = nfs.readFileSync(path.join(__dirname,  'templates', (name + '.ejs')), 'utf-8');
  var locals = Object.create(null);

  function render () {
    return ejs.render(contents, locals)
  }

  return {
    locals: locals,
    render: render
  }
}

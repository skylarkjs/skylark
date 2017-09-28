#!/usr/bin/env node
var program = require('commander');
const path = require('path');
const readline = require('readline')

const browse = require('../tools/browse');
const serve = require('../tools/serve');
const archiver = require('../tools/archiver');
const deploy = require('../tools/deploy');

const DEFAULT_PORT = 8086;
const DEFAULT_FOLLOW_SYMLINKS = false;
const DEFAULT_DEBUG = false;
const DEFAULT_ERROR_404 = undefined;
const DEFAULT_CORS = undefined;


/**
 * Install an around function; AOP.
 */

function around (obj, method, fn) {
  var old = obj[method]

  obj[method] = function () {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) args[i] = arguments[i]
    return fn.call(this, old, args)
  }
}

/**
 * Install a before function; AOP.
 */

function before (obj, method, fn) {
  var old = obj[method]

  obj[method] = function () {
    fn.call(this)
    old.apply(this, arguments)
  }
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm (msg, callback) {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(msg, function (input) {
    rl.close()
    callback(/^y|yes|ok|true$/i.test(input))
  })
}


/**
 * Graceful exit for async STDIO
 */

function exit (code) {
  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  function done () {
    if (!(draining--)) _exit(code)
  }

  var draining = 0
  var streams = [process.stdout, process.stderr]

  exit.exited = true

  streams.forEach(function (stream) {
    // submit empty write request and wait for completion
    draining += 1
    stream.write('', done)
  })

  done()
}


program.version('v' + require('../package.json').version)
       .description('skyarkjs slax application builder')


program.command('create <projectName>')
       .alias('i')
       .description('generate a new project from a template')
       .action(function (prj) {
         var files = asar.listPackage(archive)
         for (var i in files) {
           console.log(files[i])
         }
       });

program.command('deploy [slxPrjRoot]')
       .alias('i')
       .description('delploy  a new project from a template')
       .action(function (slxPrjRoot) {
          slxPrjRoot = slxPrjRoot || '.';
          deploy(projectDir);
       });

program.command('browse [slaxApp]')
       .alias('b')
       .description('start slax browser and run the app')
       .action(function(slaxApp){
          if (slaxApp) {
            slaxApp = path.resolve(slaxApp);
            browse(slaxApp);
          } else {
              confirm('The slax application is not specified, do you want to open the example application?? [y/N] ', function (ok) {
                if (ok) {
                  process.stdin.destroy()
                  slaxApp = path.join(__dirname,"..","examples","chapters.slax");
                  browse(slaxApp);
                } else {
                  console.error('aborting');
                  exit(1);
                }
              });
          }
       });

program.command('serve [slaxApp]')
       .alias('s')
       .description('start slax server and run the app')
//       .option('-a, --slax <n>', 'the skylark slax application file name to run')
       .option('--port <n>', 'the port to listen to for incoming HTTP connections', DEFAULT_PORT)
//       .option('-d, --debug', 'enable to show error messages', DEFAULT_DEBUG)
//       .option('-c, --cors <pattern>', 'Cross Origin Pattern. Use "*" to allow all origins', DEFAULT_CORS)
       .action(function(slaxApp,options){
         options = {
           port: options.port
         }        
          if (slaxApp) {
            slaxApp = path.resolve(slaxApp);
            serve(slaxApp,options);
          } else {
              confirm('The slax application is not specified, do you want to open a example application?? [y/N] ', function (ok) {
                if (ok) {
                  process.stdin.destroy()
                  slaxApp = path.join(__dirname,"..","examples","chapters.slax");
                  serve(slaxApp,options);
                } else {
                  console.error('aborting');
                  exit(1);
                }
              });
          }
       });


program.command('pack <dir> <outputSlaxApp>')
       .alias('p')
       .description('pack slax application archive')
       .action(function(dir,outputSlaxApp){
          archiver.pack(path.resolve(dir),path.resolve(outputSlaxApp));
       });

program.command('unpack <slaxApp> <outputDir>')
       .alias('u')
       .description('unpack slax application archive')
       .action(function(slaxApp,outputDir){
          archiver.unpack(path.resolve(slaxApp),path.resolve(outputDir));
       });

program.command('*')
       .action(function (cmd) {
         console.log('asar: \'%s\' is not an skylarkjs command. See \'skylarkjsss --help\'.', cmd)
       })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}

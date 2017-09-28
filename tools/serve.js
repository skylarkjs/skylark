const electron = require('electron');
const proc = require('child_process');
const path = require('path');
const SlaxServer = require('skylark-slax-nodeserver');
const chalk   = require('chalk');


exports = module.exports = serve;


function serve(slaxApp,options) {
// spawn Electron

 options.slax = slaxApp;
 const server = new SlaxServer(options);

 server.start(function () {
   console.log(chalk.blue('*'), 'slax server successfully started.');
   console.log(chalk.blue('*'), 'Serving files at:', chalk.cyan('http://localhost:' + options.port));
   console.log(chalk.blue('*'), 'Press', chalk.yellow.bold('Ctrl+C'), 'to shutdown.');

   return server;
});

}




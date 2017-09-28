const electron = require('electron');
const proc = require('child_process');
const path = require('path');
const skylarker = path.join(__dirname , '..','node_modules', 'skylark-slax-browser','main.js');


exports = module.exports = browse;


function browse(slaxApp) {
// spawn Electron

 const child = proc.spawn(electron,[skylarker,slaxApp]);


}




const electron = require('electron');
const proc = require('child_process');
const path = require('path');
const asar = require('asar');


exports = module.exports = {
	"pack" : pack,
	"unpack" : unpack
};


function pack(dir,slaxApp) {
	 asar.createPackage(dir, slaxApp, function (error) {
	   if (error) {
	     console.error(error.stack)
	     process.exit(1)
	   }
	 });
}



function unpack(slaxApp,dir) {
// spawn Electron

 asar.extractAll(slaxApp, dir);

}

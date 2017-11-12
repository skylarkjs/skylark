const electron = require('electron');
const del = require('del');
const zipper  = require("zip-local");
const fs = require('fs');
const proc = require('child_process');
const path = require('path');
const asar = require('asar');


exports = module.exports = {
	"pack" : pack,
	"unpack" : unpack
};


function ensureAppDir(slaxAppDir) {
    if (fs.existsSync(slaxAppDir)) {
        del.sync([slaxAppDir + '/**/*'], {
            force: true
        });       
        fs.rmdirSync(slaxAppDir);
    }
    fs.mkdirSync(slaxAppDir);
}

var extractSlaxFile = function(slaxFileName,slaxAppDir) {

    try {
        ensureAppDir();
        zipper.sync.unzip(slaxFileName).save(slaxAppDir);
    } catch (e) {
        console.log("The slax file is not a zipped file? extract as a asar file",e);
        ensureAppDir();

        asar.extractAll(slaxFileName,slaxAppDir);
    }
};

function pack(slaxAppDir,slaxFileName) {
    console.log(slaxAppDir);
	zipper.sync.zip(slaxAppDir).compress().save(slaxFileName);
}



function unpack(slaxFileName,slaxAppDir) {

	try {
	    ensureAppDir(slaxAppDir);
	    zipper.sync.unzip(slaxFileName).save(slaxAppDir);
	} catch (e) {
	    console.log("The slax file is not a zipped file? extract as a asar file",e);
	    ensureAppDir(slaxAppDir);

	    asar.extractAll(slaxFileName,slaxAppDir);
	}
}

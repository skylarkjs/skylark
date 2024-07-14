var gulp = require('gulp'),
    setting = require('../settings'),
    nfs = require('skynode-nfs');


const cleanDist = (dirPath,exclude) => {
  if (!nfs.existsSync(dirPath)) { return }

  // file or dir
  const items = nfs.readdirSync(dirPath)
  for (const item of items) {
  	if (item==exclude) {
  		continue;
  	}
    const deleteTarget = nfs.join(dirPath, item)
    if (nfs.lstatSync(deleteTarget).isDirectory()) {
      nfs.rimraf.sync(deleteTarget)
    } else {
      nfs.removeSync(deleteTarget)
    }
  }
}
module.exports = function(done) {
    console.log('Clean folder:', setting.directories.obj);
	///nfs.removeSync(setting.directories.obj);
	nfs.rimraf.sync(setting.directories.obj)

    console.log('Clean folder:', setting.directories.dist);
	//nfs.removeSync(setting.directories.dist);
	//nfs.rmdirSync(setting.directories.dist);
	///nfs.rimraf.sync(setting.directories.dist);
	cleanDist(setting.directories.dist,"extras");

	done();
};

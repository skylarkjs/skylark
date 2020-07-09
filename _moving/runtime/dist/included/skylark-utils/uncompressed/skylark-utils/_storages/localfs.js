/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2014/02/28
 */
define([
    "../langx"
], function(langx){
	var Deferred = langx.Deferred,
		requestFileSystem =  window.requestFileSystem || window.webkitRequestFileSystem,
		resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL,
     	BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;


	function errorHandler(e) {
	  var msg = '';

	  switch (e.code) {
	    case FileError.QUOTA_EXCEEDED_ERR:
	      msg = 'QUOTA_EXCEEDED_ERR';
	      break;
	    case FileError.NOT_FOUND_ERR:
	      msg = 'NOT_FOUND_ERR';
	      break;
	    case FileError.SECURITY_ERR:
	      msg = 'SECURITY_ERR';
	      break;
	    case FileError.INVALID_MODIFICATION_ERR:
	      msg = 'INVALID_MODIFICATION_ERR';
	      break;
	    case FileError.INVALID_STATE_ERR:
	      msg = 'INVALID_STATE_ERR';
	      break;
	    default:
	      msg = 'Unknown Error';
	      break;
	  };

	  return msg;
	}
	
	var FileSystem = langx.Evented.inherit({
		_fs : null,
		_isPersisted : true,
		_cwd : null,

		init:	function (fs) {
			this._fs = fs;
			this._cwd = fs.root;
		},
			

		readfileAsArrayBuffer :  function (path,callback,errback) {
		    this._cwd.getFile(path, {}, function (fileEntry) {
		      fileEntry.file(function (file) {
		        var reader = new FileReader();
		        reader.onloadend = function () {
		          callback(null, this.result);
		        };
		        reader.readAsArrayBuffer(file);
		      }, errback);
		    }, errback);
		},

		readfileAsDataURL :  function (path,callback,errback) {
		    this._cwd.getFile(path, {}, function (fileEntry) {
		      fileEntry.file(function (file) {
		        var reader = new FileReader();
		        reader.onloadend = function () {
		          callback(null, this.result);
		        };
		        reader.readAsDataURL(file);
		      }, errback);
		    }, errback);
		},

		readfileAsText :  function (path,callback,errback) {
		    this._cwd.getFile(path, {}, function (fileEntry) {
		      fileEntry.file(function (file) {
		        var reader = new FileReader();
		        reader.onloadend = function () {
		          callback(null, this.result);
		        };
		        reader.readAsText(file);
		      }, errback);
		    }, errback);
		},

		writefile : function (path, contents, callback,errback) {
		    var self = this,
		    	folders = path.split('/');
		    folders = folders.slice(0, folders.length - 1);

		    this.mkdir(folders.join('/'),function(){
			    self._cwd.getFile(path, {create: true}, function (fileEntry) {
			      fileEntry.createWriter(function (fileWriter) {
			        var truncated = false;
			        fileWriter.onwriteend = function () {
			          if (!truncated) {
			            truncated = true;
			            this.truncate(this.position);
			            return;
			          }
			          callback && callback();
			        };
			        fileWriter.onerror = errback;
			        // TODO: find a way to write as binary too
			        var blob = contents;
			        if (!blob instanceof Blob) {
			        	blob = new Blob([contents], {type: 'text/plain'});
			        } 
			        fileWriter.write(blob);
			      }, errback);
			    }, errback);

		    });
		},

		rmfile : function (path, callback,errback) {
		    this._cwd.getFile(path, {}, function (fileEntry) {
		      fileEntry.remove(function () {
		        callback();
		      }, errback);
		    }, errback);
		},

		readdir : function (path, callback,errback) {
		    this._cwd.getDirectory(path, {}, function (dirEntry) {
		      var dirReader = dirEntry.createReader();
		      var entries = [];
		      readEntries();
		      function readEntries() {
		        dirReader.readEntries(function (results) {
		          if (!results.length) {
		            callback(null, entries);
		          }
		          else {
		            entries = entries.concat(
		            	Array.prototype.slice.call(results).map(
		            		function (entry) {
		              			return entry.name + (entry.isDirectory ? "/" : "");
		            		}
		            	)
		            );
		            readEntries();
		          }
		        }, errback);
		      }
		    }, errback);
		},

		mkdir : function (path, callback,errback) {
		    var folderParts = path.split('/');

		    var createDir = function(rootDir, folders) {
		      // Throw out './' or '/' and move on. Prevents: '/foo/.//bar'.
		      if (folders[0] == '.' || folders[0] == '') {
		        folders = folders.slice(1);
		      }

		      if (folders.length ==0) {
		      	callback(rootDir);
		      	return;
		      }
		      rootDir.getDirectory(folders[0], {create: true, exclusive: false},
		        function (dirEntry) {
		          if (dirEntry.isDirectory) { // TODO: check shouldn't be necessary.
		            // Recursively add the new subfolder if we have more to create and
		            // There was more than one folder to create.
		            if (folders.length && folderParts.length != 1) {
		              createDir(dirEntry, folders.slice(1));
		            } else {
		              // Return the last directory that was created.
		              if (callback) callback(dirEntry);
		            }
		          } else {
		            var e = new Error(path + ' is not a directory');
		            if (errback) {
		              errback(e);
		            } else {
		              throw e;
		            }
		          }
		        },
		        function(e) {
		            if (errback) {
		              errback(e);
		            } else {
		              throw e;
		            }
		        }
		      );
		    };

		    createDir(this._cwd, folderParts);

		},

		rmdir : function (path, callback,errback) {
		    this._cwd.getDirectory(path, {}, function (dirEntry) {
		      dirEntry.removeRecursively(function () {
		        callback();
		      }, errback);
		    }, errback);
		  },

		copy : function (src, dest, callback) {
		    // TODO: make sure works for cases where dest includes and excludes file name.
		    this._cwd.getFile(src, {}, function(fileEntry) {
		      cwd.getDirectory(dest, {}, function(dirEntry) {
		        fileEntry.copyTo(dirEntry, function () {
		          callback();
		        }, callback);
		      }, callback);
		    }, callback);
		},

		move : function(src, dest, callback) {
		    // TODO: handle more cases like file renames and moving/renaming directories
		    this._cwd.getFile(src, {}, function(fileEntry) {
		      cwd.getDirectory(dest, {}, function(dirEntry) {
		        fileEntry.moveTo(dirEntry, function () {
		          callback();
		        }, callback);
		      }, callback);
		    }, callback);
		},

		chdir : function (path, callback) {
		    this._cwd.getDirectory(path, {}, function (dirEntry) {
		      cwd = dirEntry;
		      if (fs.onchdir) {
		        fs.onchdir(cwd.fullPath);
		      }
		      callback();
		    }, callback);
		},

		importFromHost : function(files) {
		    // Duplicate each file the user selected to the app's fs.
		    var deferred = new Deferred();
		    for (var i = 0, file; file = files[i]; ++i) {
		        (function(f) {
			        cwd.getFile(file.name, {create: true, exclusive: true}, function(fileEntry) {
			          fileEntry.createWriter(function(fileWriter) {
			            fileWriter.write(f); // Note: write() can take a File or Blob object.
			          }, errorHandler);
			        }, errorHandler);
		     	})(file);
 	   	 	}
  		    return deferred.promise;
		  },

		  exportToHost : function() {

		  }
	
	});
	


    function localfs() {
        return localfs;
    }

    langx.mixin(localfs, {
        isSupported : function() {
            return !!requestFileSystem;
        },
        request : function(size,isPersisted){
        	size = size || 1024 * 1024 * 10;
        	var typ = isPersisted ? PERSISTENT : TEMPORARY,
        		d = new Deferred();
            requestFileSystem(typ, size, function(_fs) {
                var fs = new FileSystem(_fs,!!isPersisted);
                d.resolve(fs);
            }, function(e) {
            	d.reject(e);
            });

            return d.promise;
        },

        FileSystem : FileSystem
    });
    
	return localfs;
});
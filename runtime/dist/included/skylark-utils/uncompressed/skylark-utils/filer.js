define([
    "./skylark",
    "./langx",
    "./datax",
    "./eventer",
    "./styler"
], function(skylark, langx, datax, eventer,styler) {
    var concat = Array.prototype.concat,
        on = eventer.on,
        attr = eventer.attr,
        Deferred = langx.Deferred,

        fileInput,
        fileInputForm,
        fileSelected,
        maxFileSize = 1 / 0;


    var webentry = (function(){
        function  one(entry, path) {
            var d = new Deferred(),
                onError = function(e) {
                    d.reject(e);
                };

            path = path || '';
            if (entry.isFile) {
                entry.file(function (file) {
                    file.relativePath = path;
                    d.resolve(file);
                }, onError);
            } else if (entry.isDirectory) {
                var dirReader = entry.createReader();
                dirReader.readEntries(function (entries) {
                    all(
                        entries,
                        path + entry.name + '/'
                    ).then(function (files) {
                        d.resolve(files);
                    }).catch(onError);
                }, onError);
            } else {
                // Return an empy list for file system items
                // other than files or directories:
                d.resolve([]);
            }
            return d.promise;
        }

        function all(entries, path) {
            return Deferred.all(
                langx.map(entries, function (entry) {
                    return one(entry, path);
                })
            ).then(function(){
                return concat.apply([],arguments);
            });
        }

        return {
            one : one,
            all : all
        };
    })();

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    function dropzone(elm, params) {
        params = params || {};
        var hoverClass = params.hoverClass || "dropzone",
            droppedCallback = params.dropped;

        var enterdCount = 0;
        on(elm, "dragenter", function(e) {
            if (e.dataTransfer && e.dataTransfer.types.indexOf("Files")>-1) {
                eventer.stop(e);
                enterdCount ++;
                styler.addClass(elm,hoverClass)
            }
        });

        on(elm, "dragover", function(e) {
            if (e.dataTransfer && e.dataTransfer.types.indexOf("Files")>-1) {
                eventer.stop(e);
            }
        });

        on(elm, "dragleave", function(e) {
            if (e.dataTransfer && e.dataTransfer.types.indexOf("Files")>-1) {
                enterdCount--
                if (enterdCount==0) {
                    styler.removeClass(elm,hoverClass);
                }
            }
        });

        on(elm, "drop", function(e) {
            if (e.dataTransfer && e.dataTransfer.types.indexOf("Files")>-1) {
                styler.removeClass(elm,hoverClass)
                eventer.stop(e);
                if (droppedCallback) {
                    var items = e.dataTransfer.items;
                    if (items && items.length && (items[0].webkitGetAsEntry ||
                        items[0].getAsEntry)) {
                        webentry.all(
                            langx.map(items, function (item) {
                                if (item.webkitGetAsEntry) {
                                    return item.webkitGetAsEntry();
                                }
                                return item.getAsEntry();
                            })
                        ).then(droppedCallback);
                    } else {
                        droppedCallback(e.dataTransfer.files);
                    }                    
                }
            }
        });

        return this;
    }

    function pastezone(elm,params) {
        params = params || {};
        var hoverClass = params.hoverClass || "pastezone",
            pastedCallback = params.pasted;

        on(elm, "paste", function(e) {
            var items = e.originalEvent && e.originalEvent.clipboardData &&
                    e.originalEvent.clipboardData.items,
                files = [];
            if (items && items.length) {
                langx.each(items, function (index, item) {
                    var file = item.getAsFile && item.getAsFile();
                    if (file) {
                        files.push(file);
                    }
                });
            }
            if (pastedCallback && files.length) {
                pastedCallback(files);
            }
        });

        return this;
    }
   
    function picker(elm, params) {
        on(elm, "click", function(e) {
            e.preventDefault();
            select(params);
        });
        return this;
    }

    function select(params) {
        params = params || {};
        var directory = params.directory || false, 
            multiple = params.multiple || false,
            fileSelected = params.picked;
        if (!fileInput) {
            var input = fileInput = document.createElement("input");

            function selectFiles(pickedFiles) {
                for (var i = pickedFiles.length; i--;) {
                    if (pickedFiles[i].size > maxFileSize) {
                        pickedFiles.splice(i, 1);
                    }
                }
                fileSelected(pickedFiles);
            }

            input.type = "file";
            input.style.position = "fixed",
                input.style.left = 0,
                input.style.top = 0,
                input.style.opacity = .001,
                document.body.appendChild(input);

            input.onchange = function(e) {
                var entries = e.target.webkitEntries || e.target.entries;

                if (entries && entries.length) {
                    webentry.all(entries).then(function(files) {
                        selectFiles(files);
                    });
                } else {
                    selectFiles(Array.prototype.slice.call(e.target.files));
                }
                // reset to "", so selecting the same file next time still trigger the change handler
                input.value = "";
            };
        }
        fileInput.multiple = multiple;
        fileInput.webkitdirectory = directory;
        fileInput.click();
    }

    function upload(params) {
        var xoptions = langx.mixin({
            contentRange : null, //

            // The parameter name for the file form data (the request argument name).
            // If undefined or empty, the name property of the file input field is
            // used, or "files[]" if the file input name property is also empty,
            // can be a string or an array of strings:
            paramName: undefined,
            // By default, each file of a selection is uploaded using an individual
            // request for XHR type uploads. Set to false to upload file
            // selections in one request each:
            singleFileUploads: true,
            // To limit the number of files uploaded with one XHR request,
            // set the following option to an integer greater than 0:
            limitMultiFileUploads: undefined,
            // The following option limits the number of files uploaded with one
            // XHR request to keep the request size under or equal to the defined
            // limit in bytes:
            limitMultiFileUploadSize: undefined,
            // Multipart file uploads add a number of bytes to each uploaded file,
            // therefore the following option adds an overhead for each file used
            // in the limitMultiFileUploadSize configuration:
            limitMultiFileUploadSizeOverhead: 512,
            // Set the following option to true to issue all file upload requests
            // in a sequential order:
            sequentialUploads: false,
            // To limit the number of concurrent uploads,
            // set the following option to an integer greater than 0:
            limitConcurrentUploads: undefined,
            // By default, XHR file uploads are sent as multipart/form-data.
            // The iframe transport is always using multipart/form-data.
            // Set to false to enable non-multipart XHR uploads:
            multipart: true,
            // To upload large files in smaller chunks, set the following option
            // to a preferred maximum chunk size. If set to 0, null or undefined,
            // or the browser does not support the required Blob API, files will
            // be uploaded as a whole.
            maxChunkSize: undefined,
            // When a non-multipart upload or a chunked multipart upload has been
            // aborted, this option can be used to resume the upload by setting
            // it to the size of the already uploaded bytes. This option is most
            // useful when modifying the options object inside of the "add" or
            // "send" callbacks, as the options are cloned for each file upload.
            uploadedBytes: undefined,
            // By default, failed (abort or error) file uploads are removed from the
            // global progress calculation. Set the following option to false to
            // prevent recalculating the global progress data:
            recalculateProgress: true,
            // Interval in milliseconds to calculate and trigger progress events:
            progressInterval: 100,
            // Interval in milliseconds to calculate progress bitrate:
            bitrateInterval: 500,
            // By default, uploads are started automatically when adding files:
            autoUpload: true,

            // Error and info messages:
            messages: {
                uploadedBytes: 'Uploaded bytes exceed file size'
            },

            // Translation function, gets the message key to be translated
            // and an object with context specific data as arguments:
            i18n: function (message, context) {
                message = this.messages[message] || message.toString();
                if (context) {
                    langx.each(context, function (key, value) {
                        message = message.replace('{' + key + '}', value);
                    });
                }
                return message;
            },

            // Additional form data to be sent along with the file uploads can be set
            // using this option, which accepts an array of objects with name and
            // value properties, a function returning such an array, a FormData
            // object (for XHR file uploads), or a simple object.
            // The form of the first fileInput is given as parameter to the function:
            formData: function (form) {
                return form.serializeArray();
            },

            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop, paste or add API call).
            // If the singleFileUploads option is enabled, this callback will be
            // called once for each file in the selection for XHR file uploads, else
            // once for each file selection.
            //
            // The upload starts when the submit method is invoked on the data parameter.
            // The data object contains a files property holding the added files
            // and allows you to override plugin options as well as define ajax settings.
            //
            // Listeners for this callback can also be bound the following way:
            // .bind('fileuploadadd', func);
            //
            // data.submit() returns a Promise object and allows to attach additional
            // handlers using jQuery's Deferred callbacks:
            // data.submit().done(func).fail(func).always(func);
            add: function (e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                if (data.autoUpload || (data.autoUpload !== false &&
                        $(this).fileupload('option', 'autoUpload'))) {
                    data.process().done(function () {
                        data.submit();
                    });
                }
            },

            // Other callbacks:

            // Callback for the submit event of each file upload:
            // submit: function (e, data) {}, // .bind('fileuploadsubmit', func);

            // Callback for the start of each file upload request:
            // send: function (e, data) {}, // .bind('fileuploadsend', func);

            // Callback for successful uploads:
            // done: function (e, data) {}, // .bind('fileuploaddone', func);

            // Callback for failed (abort or error) uploads:
            // fail: function (e, data) {}, // .bind('fileuploadfail', func);

            // Callback for completed (success, abort or error) requests:
            // always: function (e, data) {}, // .bind('fileuploadalways', func);

            // Callback for upload progress events:
            // progress: function (e, data) {}, // .bind('fileuploadprogress', func);

            // Callback for global upload progress events:
            // progressall: function (e, data) {}, // .bind('fileuploadprogressall', func);

            // Callback for uploads start, equivalent to the global ajaxStart event:
            // start: function (e) {}, // .bind('fileuploadstart', func);

            // Callback for uploads stop, equivalent to the global ajaxStop event:
            // stop: function (e) {}, // .bind('fileuploadstop', func);

            // Callback for change events of the fileInput(s):
            // change: function (e, data) {}, // .bind('fileuploadchange', func);

            // Callback for paste events to the pasteZone(s):
            // paste: function (e, data) {}, // .bind('fileuploadpaste', func);

            // Callback for drop events of the dropZone(s):
            // drop: function (e, data) {}, // .bind('fileuploaddrop', func);

            // Callback for dragover events of the dropZone(s):
            // dragover: function (e) {}, // .bind('fileuploaddragover', func);

            // Callback for the start of each chunk upload request:
            // chunksend: function (e, data) {}, // .bind('fileuploadchunksend', func);

            // Callback for successful chunk uploads:
            // chunkdone: function (e, data) {}, // .bind('fileuploadchunkdone', func);

            // Callback for failed (abort or error) chunk uploads:
            // chunkfail: function (e, data) {}, // .bind('fileuploadchunkfail', func);

            // Callback for completed (success, abort or error) chunk upload requests:
            // chunkalways: function (e, data) {}, // .bind('fileuploadchunkalways', func);

            // The plugin options are used as settings object for the ajax calls.
            // The following are jQuery ajax settings required for the file uploads:
            processData: false,
            contentType: false,
            cache: false
        },params);

        var blobSlice = function () {
            var slice = Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice;
            return slice.apply(this, arguments);
        },ajax = function(data) {
            return langx.Xhr.request(data.url,data);
        };

        function initDataSettings(o) {
            o.type = o.type || "POST";

            if (!chunkedUpload(o, true)) {
                if (!o.data) {
                    initXHRData(o);
                }
                //initProgressListener(o);
            }
        }

        function initXHRData(o) {
            var that = this,
                formData,
                file = o.files[0],
                // Ignore non-multipart setting if not supported:
                multipart = o.multipart,
                paramName = langx.type(o.paramName) === 'array' ?
                    o.paramName[0] : o.paramName;

            o.headers = langx.mixin({}, o.headers);
            if (o.contentRange) {
                o.headers['Content-Range'] = o.contentRange;
            }
            if (!multipart) {
                o.headers['Content-Disposition'] = 'attachment; filename="' +
                    encodeURI(file.name) + '"';
                o.contentType = file.type || 'application/octet-stream';
                o.data = o.blob || file;
            } else {
                formData = new FormData();
                if (o.blob) {
                    formData.append(paramName, o.blob, file.name);
                } else {
                    langx.each(o.files, function (index, file) {
                        // This check allows the tests to run with
                        // dummy objects:
                        formData.append(
                            (langx.type(o.paramName) === 'array' &&
                                o.paramName[index]) || paramName,
                            file,
                            file.uploadName || file.name
                        );
                    });                    
                }                
                o.data = formData;
            }
            // Blob reference is not needed anymore, free memory:
            o.blob = null;
        }

        function getTotal(files) {
            var total = 0;
            langx.each(files, function (index, file) {
                total += file.size || 1;
            });
            return total;
        }

        function getUploadedBytes(jqXHR) {
            var range = jqXHR.getResponseHeader('Range'),
                parts = range && range.split('-'),
                upperBytesPos = parts && parts.length > 1 &&
                    parseInt(parts[1], 10);
            return upperBytesPos && upperBytesPos + 1;
        }

        function initProgressObject(obj) {
            var progress = {
                loaded: 0,
                total: 0,
                bitrate: 0
            };
            if (obj._progress) {
                langx.mixin(obj._progress, progress);
            } else {
                obj._progress = progress;
            }
        }

        function BitrateTimer() {
            this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
            this.loaded = 0;
            this.bitrate = 0;
            this.getBitrate = function (now, loaded, interval) {
                var timeDiff = now - this.timestamp;
                if (!this.bitrate || !interval || timeDiff > interval) {
                    this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
                    this.loaded = loaded;
                    this.timestamp = now;
                }
                return this.bitrate;
            };
        }

        function chunkedUpload(options, testOnly) {
            options.uploadedBytes = options.uploadedBytes || 0;
            var that = this,
                file = options.files[0],
                fs = file.size,
                ub = options.uploadedBytes,
                mcs = options.maxChunkSize || fs,
                slice = blobSlice,
                dfd = new Deferred(),
                promise = dfd.promise,
                jqXHR,
                upload;
            if (!(slice && (ub || mcs < fs)) ||
                    options.data) {
                return false;
            }
            if (testOnly) {
                return true;
            }
            if (ub >= fs) {
                file.error = options.i18n('uploadedBytes');
                return this._getXHRPromise(
                    false,
                    options.context,
                    [null, 'error', file.error]
                );
            }
            // The chunk upload method:
            upload = function () {
                // Clone the options object for each chunk upload:
                var o = langx.mixin({}, options),
                    currentLoaded = o._progress.loaded;
                o.blob = slice.call(
                    file,
                    ub,
                    ub + mcs,
                    file.type
                );
                // Store the current chunk size, as the blob itself
                // will be dereferenced after data processing:
                o.chunkSize = o.blob.size;
                // Expose the chunk bytes position range:
                o.contentRange = 'bytes ' + ub + '-' +
                    (ub + o.chunkSize - 1) + '/' + fs;
                // Process the upload data (the blob and potential form data):
                initXHRData(o);
                // Add progress listeners for this chunk upload:
                //initProgressListener(o);
                jqXHR = $.ajax(o).done(function (result, textStatus, jqXHR) {
                        ub = getUploadedBytes(jqXHR) ||
                            (ub + o.chunkSize);
                        // Create a progress event if no final progress event
                        // with loaded equaling total has been triggered
                        // for this chunk:
                        if (currentLoaded + o.chunkSize - o._progress.loaded) {
                            dfd.progress({
                                lengthComputable: true,
                                loaded: ub - o.uploadedBytes,
                                total: ub - o.uploadedBytes
                            });
                        }
                        options.uploadedBytes = o.uploadedBytes = ub;
                        o.result = result;
                        o.textStatus = textStatus;
                        o.jqXHR = jqXHR;
                        //that._trigger('chunkdone', null, o);
                        //that._trigger('chunkalways', null, o);
                        if (ub < fs) {
                            // File upload not yet complete,
                            // continue with the next chunk:
                            upload();
                        } else {
                            dfd.resolveWith(
                                o.context,
                                [result, textStatus, jqXHR]
                            );
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        o.jqXHR = jqXHR;
                        o.textStatus = textStatus;
                        o.errorThrown = errorThrown;
                        //that._trigger('chunkfail', null, o);
                        //that._trigger('chunkalways', null, o);
                        dfd.rejectWith(
                            o.context,
                            [jqXHR, textStatus, errorThrown]
                        );
                    });
            };
            //this._enhancePromise(promise);
            promise.abort = function () {
                return jqXHR.abort();
            };
            upload();
            return promise;
        }
        
        initDataSettings(xoptions);

        xoptions._bitrateTimer = new BitrateTimer();

        var jqXhr = chunkedUpload(xoptions) || ajax(xoptions);

        jqXhr.options = xoptions;

        return jqXhr;
    }

    var filer = function() {
        return filer;
    };

    langx.mixin(filer , {
        dropzone: dropzone,

        pastezone: pastezone,

        picker: picker,

        select : select,

        upload  : upload,

        readFile : function(file,params) {
            params = params || {};
            var d = new Deferred,
                reader = new FileReader();
            
            reader.onload = function(evt) {
                d.resolve(evt.target.result);
            };
            reader.onerror = function(e) {
                var code = e.target.error.code;
                if (code === 2) {
                    alert('please don\'t open this page using protocol fill:///');
                } else {
                    alert('error code: ' + code);
                }
            };
            
            if (params.asArrayBuffer){
                reader.readAsArrayBuffer(file);
            } else if (params.asDataUrl) {
                reader.readAsDataURL(file);                
            } else if (params.asText) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }

            return d.promise;
        },
         
        writeFile : function(data,name) {
            if (window.navigator.msSaveBlob) { 
               if (langx.isString(data)) {
                   data = dataURItoBlob(data);
               }
               window.navigator.msSaveBlob(data, name);
            } else {
                var a = document.createElement('a');
                if (data instanceof Blob) {
                    data = langx.URL.createObjectURL(data);
                }
                a.href = data;
                a.setAttribute('download', name || 'noname');
                a.dispatchEvent(new CustomEvent('click'));
            }              
        }

    });

    return skylark.filer = filer;
});

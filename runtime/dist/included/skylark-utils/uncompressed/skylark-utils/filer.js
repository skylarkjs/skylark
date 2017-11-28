define([
    "./skylark",
    "./langx",
    "./eventer",
    "./styler"
], function(skylark, langx, eventer,styler) {
    var on = eventer.on,
        attr = eventer.attr,
        Deferred = langx.Deferred,

        fileInput,
        fileInputForm,
        fileSelected,
        maxFileSize = 1 / 0;

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    function selectFile(callback) {
        fileSelected = callback;
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
                selectFiles(Array.prototype.slice.call(e.target.files));
                // reset to "", so selecting the same file next time still trigger the change handler
                input.value = "";
            };
        }
        fileInput.click();
    }

    function upload(files, url, params) {
        params = params || {};
        var chunkSize = params.chunkSize || 0,
            maxSize = params.maxSize || 0,
            progressCallback = params.progress,
            errorCallback = params.error,
            completedCallback = params.completed,
            uploadedCallback = params.uploaded;


        function uploadOneFile(fileItem,oneFileloadedSize, fileItems) {
            function handleProcess(nowLoadedSize) {
                var t;
                speed = Math.ceil(oneFileloadedSize + nowLoadedSize / ((now() - uploadStartedTime) / 1e3)), 
                percent = Math.round((oneFileloadedSize + nowLoadedSize) / file.size * 100); 
                if (progressCallback) {
                    progressCallback({
                        name: file.name,
                        loaded: oneFileloadedSize + nowLoadedSize,
                        total: file.size,
                        percent: percent,
                        bytesPerSecond: speed,
                        global: {
                            loaded: allLoadedSize + oneFileloadedSize + nowLoadedSize,
                            total: totalSize
                        }
                    });
                }
            }
            var file = fileItem.file,
                uploadChunkSize = chunkSize || file.size,
                chunk = file.slice(oneFileloadedSize, oneFileloadedSize + uploadChunkSize);

            xhr = createXmlHttpRequest();
            //xhr.open("POST", url + 
            //                "?action=upload&path=" + 
            //                encodeURIComponent(path) + 
            //                "&name=" + encodeURIComponent(file.name) + 
            //                "&loaded=" + oneFileloadedSize + 
            //                "&total=" + file.size + 
            //                "&id=" + id + 
            //                "&csrf=" + encodeURIComponent(token) + 
            //                "&resolution=" + 
            //                encodeURIComponent(fileItem.type));
            xhr.upload.onprogress = function(event) {
                handleProcess(event.loaded - (event.total - h.size))
            };
            xhr.onload = function() {
                var response, i;
                xhr.upload.onprogress({
                    loaded: h.size,
                    total: h.size
                });
                try {
                    response = JSON.parse(xhr.responseText);
                } catch (e) {
                    i = {
                        code: -1,
                        message: "Error response is not proper JSON\n\nResponse:\n" + xhr.responseText,
                        data: {
                            fileName: file.name,
                            fileSize: file.size,
                            maxSize: uploadMaxSize,
                            extensions: extensions.join(", ")
                        },
                        extra: extra
                    };
                    errorFileInfos.push(i);
                    if (errorCallback) {
                        errorCallback(i);
                    }
                    return uploadFiles(fileItems)
                }
                if (response.error) {

                    i = {
                        code: response.error.code,
                        message: response.error.message,
                        data: {
                            fileName: file.name,
                            fileSize: file.size,
                            maxSize: uploadMaxSize,
                            extensions: extensions.join(", ")
                        },
                        extra: extra
                    }; 
                    errorFileInfos.push(i); 
                    if (errorCallback) {
                        errorCallback(i);
                    }
                    uploadFiles(fileItems);
                } else {
                    if (!response.error && oneFileloadedSize + uploadChunkSize < file.size) {
                        uploadOneFile(fileItem, oneFileloadedSize + uploadChunkSize, fileItems);
                    } else {
                        if (response.result) {
                            utils.each(response.result, function(e) {
                                e = File.fromJSON(e);
                                uploadFileItems.push(e);

                                if (uploadedCallback) {
                                    uploadedCallback({
                                        file: e
                                    });
                                }
                            }); 

                        } 
                        allLoadedSize += file.size;
                        response.result && k.push(response.result);
                        uploadFiles(fileItems);
                    }                            
                }     

            };
            handleProcess(0);
            xhr.send(createFormData(h));
        }

        function uploadFiles(fileItems) {
            var fileItem = fileItems.shift();
            processedFilesCount++; 
            if (fileItem && fileItem.file.error) {
                uploadFiles(fileItem);
            } else {
                if (uploadingFile) {
                    uploadOneFile(fileItem, null, 0, fileItems);
                } else {

                    if (completedCallback) {
                        completedCallback({
                            files: new FileCollection(uploadFileItems),
                            bytesPerSecond: I,
                            errors: E(D),
                            extra: extra
                        });
                    }
                }  
            }
        }

        var self = this,
            fileItems = [],
            processedFilesCount = -1,
            xhr, 
            totalSize = 0,
            allLoadedSize = 0,
            k = [],
            errorFileInfos = [],
            startedTime = now(),
            I = 0,
            uploadFileItems = [];

        for ( var  i = 0; i < files.length; i++) {
            totalSize += files[i].size;
            fileItems.push({
                file : files[i]
            });
        }        

        uploadFiles(fileItems);
    }


    var filer = function() {
        return filer;
    };

    langx.mixin(filer , {
        dropzone: function(elm, params) {
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
                        droppedCallback(e.dataTransfer.files);
                    }
                }
            });


            return this;
        },

        picker: function(elm, params) {
            params = params || {};

            var pickedCallback = params.picked;

            on(elm, "click", function(e) {
                e.preventDefault();
                selectFile(pickedCallback);
            });
            return this;
        },

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

define([
    "./skylark",
    "./langx",
    "./eventer"
], function(skylark, langx, eventer) {
    var on = eventer.on,
        attr = eventer.attr,

        fileInput,
        fileInputForm,
        fileSelected,
        maxFileSize = 1 / 0;

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
        input.click();
    }

    var filer = function() {
        return filer;
    };

    langx.mixin(filer , {
        picker: function(elm, params) {
            params = params || {};

            var pickedCallback = params.picked;

            on(elm, "click", function(e) {
                e.preventDefault();
                selectFile(pickedCallback);
            });
            return this;
        },

        dropzone: function(elm, params) {
            params = params || {};

            var droppedCallback = params.dropped;

            on(elm, "dragover,dragend", function(e) {
                return false;
            });

            on(elm, "drop", function(e) {
                e.preventDefault();
                if (droppedCallback) {
                    droppedCallback(e.dataTransfer.files);
                }
            });

            return this;
        },

    });

    return skylark.filer = filer;
});

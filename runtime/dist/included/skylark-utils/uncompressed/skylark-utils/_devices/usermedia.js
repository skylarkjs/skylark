define([
    "../langx"
], function(langx) {
    navigator.getUserMedia = navigator.getUserMedia
                        || navigator.webkitGetUserMedia
                        || navigator.mozGetUserMedia
                        || navigator.msGetUserMedia;
   
    var Deferred = langx.Deferred,
        localStream  = null;

    function usermedia() {
        return usermedia;
    }

    langx.mixin(usermedia, {
        isSupported : function() {
            return !!navigator.getUserMedia;
        },

        start : function(video,audio) {

            var d = new Deferred();
            navigator.getUserMedia (
                {video: true,audio: true},
                // successCallback
                function(stream) {
                    localStream = stream;
                    video.src = window.URL.createObjectURL(localMediaStream);
                    video.onloadedmetadata = function(e) {
                         // Do something with the video here.
                    };
                    d.resolve();
                },

                // errorCallback
                function(err) {
                  d.reject(err);
                }
            );

            return d.promise;
        },

        stop : function() {
            if (localStream) {
                localStream.stop();
                localStream = null; 
            }
        }
    });


    return  usermedia;
});

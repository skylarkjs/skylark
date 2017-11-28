define([
    "../langx"
], function(langx) {
    navigator.vibrate = navigator.vibrate
                        || navigator.webkitVibrate
                        || navigator.mozVibrate
                        || navigator.msVibrate;
    

    function vibrate() {
        return vibrate;
    }

    langx.mixin(vibrate, {
        isSupported : function() {
            return !!navigator.vibrate;
        },

        start : function(duration) {
            navigator.vibrate(duration);
        },

        stop : function() {
            navigator.vibrate(0);
        }
    });


    return  vibrate;
});

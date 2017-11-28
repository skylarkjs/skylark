define([
    "./skylark",
    "./langx",
    "./_devices/usermedia",
    "./_devices/vibrate"
], function(skylark,langx,usermedia,vibrate) {

    function devices() {
        return devices;
    }

    langx.mixin(devices, {
        usermedia: usermedia,
        vibrate : vibrate
    });


    return skylark.devices = devices;
});

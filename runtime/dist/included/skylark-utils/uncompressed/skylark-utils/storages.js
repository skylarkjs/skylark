define([
    "./skylark",
    "./langx",
    "./_storages/cookies",
    "./_storages/localfs",
    "./_storages/localStorage",
    "./_storages/sessionStorage"
], function(skylark,langx,cookies,localfs,localStorage,sessionStorage) {
    function storages() {
        return storages;
    }

    langx.mixin(storages, {
        cookies: cookies,
        localfs : localfs,
        localStorage : localStorage,
        sessionStorage : sessionStorage
    });


    return skylark.storages = storages;
});

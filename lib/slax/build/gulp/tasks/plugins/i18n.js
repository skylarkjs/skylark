define(['module'], function (module) {
    var masterConfig = module.config ? module.config() : {};

    return {
        version: '2.0.6',
        /**
         * Called when a dependency needs to be loaded.
         */
        load: function (name, req, onLoad, config) {
            onLoad();
        }
    };
});

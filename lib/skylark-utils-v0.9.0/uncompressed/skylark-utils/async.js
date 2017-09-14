define([
    "./skylark",
    "./langx"
], function(skylark,langx) {

    var Deferred = function() {
        this.promise = new Promise(function(resolve, reject) {
            this._resolve = resolve;
            this._reject = reject;
        }.bind(this));

        this.resolve = Deferred.prototype.resolve.bind(this);
        this.reject = Deferred.prototype.reject.bind(this);

    };

    Deferred.prototype.resolve = function(value) {
        this._resolve.call(this.promise, value);
        return this.promise;
    };

    Deferred.prototype.reject = function(reason) {
        this._reject.call(this.promise, reason);
        return this.promise;
    };

    Deferred.prototype.then = function(callback, errback, progback) {
        return this.promise.then(callback, errback, progback);
    };

    Deferred.all = function(array) {
        return Promise.all(array);
    };

    Deferred.first = function(array) {
        return Promise.race(array);
    };

    Deferred.when = function(valueOrPromise, callback, errback, progback) {
        var receivedPromise = valueOrPromise && typeof valueOrPromise.then === "function";
        var nativePromise = receivedPromise && valueOrPromise instanceof Promise;

        if (!receivedPromise) {
            if (arguments.length > 1) {
                return callback ? callback(valueOrPromise) : valueOrPromise;
            } else {
                return new Deferred().resolve(valueOrPromise);
            }
        } else if (!nativePromise) {
            var deferred = new Deferred(valueOrPromise.cancel);
            valueOrPromise.then(deferred.resolve, deferred.reject, deferred.progress);
            valueOrPromise = deferred.promise;
        }

        if (callback || errback || progback) {
            return valueOrPromise.then(callback, errback, progback);
        }
        return valueOrPromise;
    };

    Deferred.reject = function(err) {
        var d = new Deferred();
        d.reject(err);
        return d.promise;
    };

    Deferred.resolve = function(data) {
        var d = new Deferred();
        d.resolve(data);
        return d.promise;
    };

    Deferred.immediate = Deferred.resolve;

    function debounce(fn, wait) {
        var timeout,
            args,
            later = function() {
                fn.apply(null, args);
            };

        return function() {
            args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function nextTick(fn) {
        requestAnimationFrame(fn);
        return this;
    }

    function async(fn) {
        return async;
    }

    langx.mixin(async, {
        all: Deferred.all,
        debounce: debounce,
        Deferred: Deferred,
        first : Deferred.first,
        nextTick : nextTick,
        reject : Deferred.reject,
        resolve : Deferred.resolve,
        when: Deferred.when
    });

    return skylark.async = async;
});

define([
    "./skylark",
    "./langx"
],function(skylark, langx){
    var Deferred = langx.Deferred,
        blankRE = /^\s*$/,
        scriptTypeRE = /^(?:text|application)\/javascript/i,
        xmlTypeRE = /^(?:text|application)\/xml/i;


    function empty() {}

    var ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function() {
            return new window.XMLHttpRequest();
        },
        // MIME types mapping
        // IIS returns Javascript as "application/x-javascript"
        accepts: {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json: 'application/json',
            xml: 'application/xml, text/xml',
            html: 'text/html',
            text: 'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true
    }

    function mimeToDataType(mime) {
        if (mime) {
            mime = mime.split(';', 2)[0];
        }
        return mime && (mime == 'text/html' ? 'html' :
            mime == 'application/json' ? 'json' :
            scriptTypeRE.test(mime) ? 'script' :
            xmlTypeRE.test(mime) && 'xml') || 'text';
    }

    function appendQuery(url, query) {
        if (query == '') {
            return url;
        }
        return (url + '&' + query).replace(/[&?]{1,2}/, '?');
    }

    function serialize(params, obj, traditional, scope) {
        var type, array = langx.isArray(obj),
            hash = langx.isPlainObject(obj)
        langx.each(obj, function(key, value) {
            type = langx.type(value);
            if (scope) {
                key = traditional ? scope :
                        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']' ;
            }
            // handle data in serializeArray() format
            if (!scope && array) {
                params.add(value.name, value.value);
            // recurse into nested objects
            } else if (type == "array" || (!traditional && type == "object")) {
                serialize(params, value, traditional, key);
            } else {
                params.add(key, value);
            }
        })
    }    

    function param(obj, traditional) {
        var params = []
        params.add = function(key, value) {
            if (langx.isFunction(value)) {
                value = value();
            }
            if (value == null) {
                value = "";
            }
            this.push(escape(key) + '=' + escape(value));
        }
        
        serialize(params, obj, traditional);

        return params.join('&').replace(/%20/g, '+')
    }

    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
        if (options.processData && options.data && !langx.isString(options.data)) {
            options.data = $.param(options.data, options.traditional)
        }
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) {
            options.url = appendQuery(options.url, options.data);
            options.data = undefined;
        }
    }

    function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context,
            status = 'success'
        settings.success.call(context, data, status, xhr)
        //if (deferred) deferred.resolveWith(context, [data, status, xhr])
        //triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
    }
    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        //if (deferred) deferred.rejectWith(context, [xhr, type, error])
        //triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
        ajaxComplete(type, xhr, settings)
    }
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        //triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        //ajaxStop(settings)
    }    

    function ajax(options) {
        var settings = langx.mixin({}, options),
            deferred = new Deferred();

        langx.safeMixin(settings,ajaxSettings);

        //ajaxStart(settings)
        if (!settings.crossDomain) {
        //    settings.crossDomain = !langx.isSameOrigin(settings.url);
        }

        serializeData(settings);
        var dataType = settings.dataType;

        var mime = settings.accepts[dataType],
            headers = {},
            setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            nativeSetHeader = xhr.setRequestHeader,
            abortTimeout;

        //if (deferred) deferred.promise(xhr)

        if (!settings.crossDomain) {
            setHeader('X-Requested-With', 'XMLHttpRequest');
        }
        setHeader('Accept', mime || '*/*')
        if (mime = settings.mimeType || mime) {
            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
            xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET')) {
            setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')
        }

        if (settings.headers) {
            for (name in settings.headers) {
                setHeader(name, settings.headers[name]);
            }    
        }
        xhr.setRequestHeader = setHeader;

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty
                clearTimeout(abortTimeout)
                var result, error = false
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
                    result = xhr.responseText

                    try {
                        // http://perfectionkills.com/global-eval-what-are-the-options/
                        if (dataType == 'script') {
                            (1, eval)(result);
                        } else if (dataType == 'xml') {
                            result = xhr.responseXML
                        } else if (dataType == 'json') {
                            result = blankRE.test(result) ? null : JSON.parse(result);
                        }
                    } catch (e) { 
                        error = e 
                    }

                    if (error) {
                        ajaxError(error, 'parsererror', xhr, settings, deferred);
                    } else {
                        ajaxSuccess(result, xhr, settings, deferred);
                    }
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
                }
            }
        }

        /*
        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort()
            ajaxError(null, 'abort', xhr, settings, deferred)
            return xhr
        }

        if (settings.xhrFields)
            for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]
        */
        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async, settings.username, settings.password)

        for (name in headers) {
            nativeSetHeader.apply(xhr, headers[name]);
        }

        if (settings.timeout > 0) {
            abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, 'timeout', xhr, settings, deferred);
            }, settings.timeout);
        }

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr;
    }


    function get( /* url, data, success, dataType */ ) {
        return ajax(parseArguments.apply(null, arguments))
    }

    function post( /* url, data, success, dataType */ ) {
        var options = parseArguments.apply(null, arguments);
        options.type = 'POST';
        return ajax(options);
    }

    function getJSON( /* url, data, success */ ) {
        var options = parseArguments.apply(null, arguments);
        options.dataType = 'json';
        return ajax(options);
    }    


    function http(){
      return http;
    }

    langx.mixin(http, {
        ajax: ajax,

        get: get,
        
        gtJSON: getJSON,

        post: post

    });

    return skylark.http = http;
});

define([
    "../langx"
], function(langx) {
    function cookies() {
        return cookies;
    }

    langx.mixin(cookies, {
		get : function(name) {
		    if (!sKey || !this.has(name)) { return null; }
				return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1"));

		},

		has : function(name) {
			return (new RegExp("(?:^|;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		},


		list : function() {
		    var cookies = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		    for (var i = 0; i < cookies.length; i++) { 
		    	cookies[i] = unescape(cookies[i]); 
		    }
		    return cookies;
		},

		remove : function(name,path) {
		    if (!name || !this.has(name)) { 
		    	return; 
		   	}
		    document.cookie = escape(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (path ? "; path=" + path : "");
		},

		set: function (name, value, expires, path, domain, secure) {
		    if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) { return; }
		    var sExpires = "";
		    if (expires) {
		      switch (expires.constructor) {
		        case Number:
		          sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + expires;
		          break;
		        case String:
		          sExpires = "; expires=" + expires;
		          break;
		        case Date:
		          sExpires = "; expires=" + expires.toGMTString();
		          break;
		      }
		    }
		    document.cookie = escape(name) + "=" + escape(value) + sExpires + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");
		  }	
    });


    return  cookies;

});


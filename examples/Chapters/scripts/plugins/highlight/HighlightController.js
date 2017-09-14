define([
	"skylarkjs"
],function(skylark){
    var spa = skylark.spa,
        $ = skylark.query;

	return spa.PluginController.inherit({
        klassName: "HighlightController",

        prepare() {

        },

        routed (e) {
            var links = $("a.active");

            links.removeClass("active");

            links = $("a[href*=\"'" + e.current.path + "'\"]");
            links.addClass("active");
            links[0].focus();
        }
	})

});

define([
	"skylark/spa",
	"skylark/query",
	"text!./templates/home.html"
],function(spa,$,tpl){

	return spa.RouteController.inherit({
        klassName: "HomeController",

        rendering(e) {
            e.content = tpl;
        },

    	exited(e) {
            console.log('good bye Home');
    	}
	})

});

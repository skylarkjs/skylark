define([
	"skylark/spa",
    "skylark/langx",
	"skylark/query",
	"text!./templates/home.html"
],function(spa,langx,$,tpl){

	return spa.RouteController.inherit({
        klassName: "HomeController",

        rendering(e) {
            e.content =  langx.substitute(tpl,{
                 name :  e.route.data.name
            });
        },

    	exited(e) {
            console.log('good bye Home');
    	}
	})

});

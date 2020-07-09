define([
	"skylarkjs",
    "text!./templates/chapter1.html",
    "text!./templates/chapter2.html",
    "text!./templates/chapter3.html"
],function(skylark,tpl1,tpl2,tpl3){
    var spa = skylark.spa,
        $ = skylark.query;
	return spa.RouteController.inherit({
        klassName: "ChapterController",

        prepare() {
        	//return this.overrided();
        },

        rendering(e) {
            var html;
            switch(e.context.params.id) {
                case "1" : html = tpl1;
                         break;
                case "2" : html = tpl2;
                         break;
                case "3" : html = tpl3;
                         break;
                default : html = "";
                         break;
            }
            e.content = html;
        },

        exiting(e) {
            var field = $('[name="field"]').val();
            if (field) {
                var ret = confirm('Are you sure you want to quit this chapter ?');
                if (!ret) {
                    e.result = false;
                }
            }           
        }
	})
	
});

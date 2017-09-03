require.config({
  baseUrl: "./"
  ,packages : [
     { name: "skylark", location: "../../../src/skylark" },
     { name: "example", location: "" }
  ]
});
 
require(["skylark/query","skylark/router"], function ($,router) {
/*
    Router.autoRun = true;

    Router.on('route', function () {
        console.log('go to ' + this.path);
    });

    Router.on('beforeRender', function () {
        console.log('before ' + this.path);
    });

    Router.on('afterRender', function () {
        console.log('after ' + this.path);
    });

    // Declare not found route
    Router.notFound = function () {
        this.render($('#not-found').html());
    };
*/
    // Declare root route
    router.route('home', {
    	pathto : '/',
        entered (){
            $("#yield").html($('#home').html());
        },
    	exited() {
            console.log('good bye Home');
    	}        
    });
    		
    router.route('page', {
    	pathto : '/page/:id',
        entered(e){
    		$("#yield").html($('#page' + e.params.id).html());
    	},
    	exited() {
            var field = $('[name="field"]').val();
            if (field) {
                return confirm('Are you sure you want to quit this page ?');
            }    		
    	}
    });
  

    //The following is to use the internal routine engine.
    if (window.seHistoryApiEngine) {
        router.useHistoryApi = true;
    } else if (window.useHashbangEngine) {
        router.useHashbang = true;
    } else if (window.useInternalEngine) {
        router.useHistoryApi = false;
        router.useHashbang = false
    } else {
        // default : useHistoryApiEngine for web or useHashbang for local html
    }

    router.on("routed",function(e){
            var links = $("a.active");

            links.removeClass("active");

            links = $("a[href*=\"'" + e.current.path + "'\"]");
            links.addClass("active");
            links[0].focus();
    });

    window.go = router.go;
    
    router.start();
    
});
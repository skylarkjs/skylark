define([
],function(){
	var config = {
	    "name" : "sidebarApp",
	    "title": "A exmaple with two web pages ",

	    "page" : {
			"routeViewer" : "#route-container"
		},
	    "plugins" : {
	      "sidebar" : {
	      	  hookers: "routed",
	      	  controller : {
	      	  	type  : "scripts/plugins/sidebar/SidebarController"
	      	  }
	      }
	    },
	    "routes" : {
	      "home": {
	          pathto : "/",
	          data: {
	              name: 'HomePage'
	          },
	          controller : {
	          	type : "scripts/routes/home/HomeController"
	          }
	      },
	      "about": {
	          pathto : "/about",
	          data: {
	              name: 'AboutPage'
	          },
	          controller : {
	          	type : "scripts/routes/about/AboutController"
	          }
	      }
	    }
	};

	return config;
});

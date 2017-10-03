const path = require('path');
const del = require('del');
const copy = require('copy-dir');
const fs = require('fs');
const tpl = require('./scaffold/tpl');
const util = require('./util');
const sjspkg = require('../package.json');

exports = module.exports = {
	"add" : add,
	"remove" : remove,
	"list" : list
};


const loadTemplate = tpl.loadTemplate;
const copyTemplate = tpl.copyTemplate;
const mkdir = util.mkdir;
const rmdir = util.rmdir;
const write = util.write;


function add(root,addingRoutes) {
	let slaxCfg = JSON.parse(util.read(path.join(root,"/src/slax-config.json"))),
		routes = slaxCfg.routes;
		
	addingRoutes.split(",").forEach(function(oneRoute) {
       let a = oneRoute.split(":"),
            name = a[0],
            path = a[1];
 

		if (routes[name]) {
			console.warn("the route:" + name+ " has been defined!");
			return;
		}
	    var routeHtml = loadTemplate('scripts/routes/route.html');
	    routeHtml.locals.name = name;
	    var routeJs = loadTemplate('scripts/routes/RouteController.js');
	    routeJs.locals.name = name;

	    var controllerName = name.charAt(0).toUpperCase() + name.slice(1)+"Controller";
	    mkdir(root+'/src/scripts/routes/'+name,function(){
		    write(root+'/src/scripts/routes/'+name + "/" + name+".html",routeHtml.render());
		    write(root+'/src/scripts/routes/'+name + "/" + controllerName+".js",routeJs.render());
	    });

	    routes[name] = {
	    	pathto : path,
	    	controller : {
	    		type : "scripts/routes/" + name + "/" + controllerName
	    	} 
	    };

	});

    write(root + '/src/slax-config.json', JSON.stringify(slaxCfg,null,2)+ '\n');

    return routes;

}

function remove(root,deletingRoutes) {
	let slaxCfg = JSON.parse(util.read(path.join(root,"/src/slax-config.json"))),
		routes = slaxCfg.routes;

	deletingRoutes.split(",").forEach(function(name) {
		if (!routes[name]) {
			console.warn("the route:" + name+ " does not exist!");
			return;
		}

	    rmdir(root+'/src/scripts/routes/'+name,function(){
	    });

	    delete routes[name];

	});

    write(root + '/src/slax-config.json', JSON.stringify(slaxCfg,null,2)+ '\n');

}

function list(root) {
	let slaxCfg = JSON.parse(util.read(path.join(root,"/src/slax-config.json"))),
		routes = slaxCfg.routes;

    console.log("the route list are following:");
	for (var name in routes) {
		console.log(" " + name + ":" + routes[name].pathto);
	};

}
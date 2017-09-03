require.config({
  baseUrl: "./"
  ,packages : [
     { name: "skylark", location: "../../../src/skylark" }
  ]
  , paths: {
	"text" : "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text"
  }
});
 
require(["skylark/spa","scripts/config"], function (spa,config) {
  var app = spa(config);
  window.go =  function(path) {
     app.go(path);
  };
  
  app.prepare().then(function(){
    app.run();
  })

});
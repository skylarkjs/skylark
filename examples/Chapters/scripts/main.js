require.config({
  baseUrl: "./"
  ,packages : [
  ]
  , paths: {
	  "text" : "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text",
    "skylark" : "../../dist/uncompressed/skylark-all" 
  }
});
 
require(["skylark","scripts/config"], function (skylark,config) {
  var app = skylark.spa(config);

  window.go =  function(path) {
     app.go(path);
  };

  app.prepare().then(function(){
    app.run();
  })

});
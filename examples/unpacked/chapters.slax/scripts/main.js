require.config({
  baseUrl: "/"
  ,packages : [
  ]
  , paths: {
	  "text" : "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text",
    "skylarkjs" : "http://registry.skylarkjs.org/packages/skylark-spa/v0.9.0/uncompressed/skylark-spa-all",
    "skylark-utils" : "http://registry.skylarkjs.org/packages/skylark-utils/v0.9.2/uncompressed/skylark-utils"
  }
  , shim: {
    'skylark-utils': {
      deps: ['skylarkjs']
    }
  }
});
 
require([
  "skylarkjs",
  "text!./slax-config.json",
  "skylark-utils"
], function (skylark,txtConfig) {
  var config = JSON.parse(txtConfig);
  var app = skylark.spa(config);

  window.go =  function(path) {
     app.go(path);
  };

  app.prepare().then(function(){
    app.run();
  })

});
# skylark.js
An unified framework for building modern html5 applications across web and desktop. http://www.skylarkjs.org

## Introduction
Skylark.js is an unified framework for building modern html5 applications across web and desktop, including the runtime library and many  development tools.
### summary

- Concise  
Skylark.js framework is very simple and powerful, the code is only 7k (core library,gzip) or 22k (including a powerful utility library), and easy to read and easy to debug.
- Anywhere  
Skyalrk.js application is archived a single .slax file. The slax archive can be deployed to web server, and  you can also run it directly on the local desktop.
- Integratable  
Skylark.js core framework focus  functional structure of an application, easy to integrate with jquery, backbone, vue, react and other popular UI framework.
- Unified  
Skylark.js is easy to unify other framework resources. Using skylark-jquery, jquery plugins and applications can run directly on skylarkjs without jquery.  
In addition, there are skylark-backbone, skylark-vue (in developping) and so on.
- Configable  
All constituent elements of the application (such as paths, plugins, dependents, and so on)  are configed in  slax-config.json file.
- Modular  
Highly modular with very little opinion of how things should be done, removing bloat and unecessary overhead.

### browser compatibility
Skylark.js supports all browsers that are ES5-compliant (IE8 and below are not supported).

## Ecosystem 

| Project | Description | Integration |
|---------|--------|-------------|
| [skylark-langx](https://github.com/skylarkjs/skylark-langx)   | javaScript language extension library| built-in on skylarkjs runtime|
| [skylark-router](https://github.com/skylarkjs/skylark-router)   |frontend routing framework| built-in on skylarkjs runtime|
| [skylark-spa](https://github.com/skylarkjs/skylark-spa)   |html5 single page application framework| built-in on skylarkjs runtime|
| [skylark-utils](https://github.com/skylarkjs/skylark-utils)   |javascript dom utility library| built-in on skylarkjs runtime(full build version)|
| [skylark-slax-browser](https://github.com/skylarkjs/skylark-slax-browser)|official desktop browser for running skylark slax application|built-in on skylarkjs development tools|
| [skylark-slax-nodeserver](https://github.com/skylarkjs/skylark-slax-nodeserver)|official  node server for running the skylark slax application|built-in on skylarkjs development tools|
| [skylark-jquery](https://github.com/skylarkjs/skylark-jquery)|an extension library fully compatible with jquery api|optional, installed by the developer as needed|
| [skylark-backbone](https://github.com/skylarkjs/skylark-backbone)|an extension library fully compatible with backbone api|optional, installed by the developer as needed|

##  Runtime
###  different builds
|  | build | Description |
|---------|--------|-------------|
| full | skylarkjs.js | included skylark-utils |
|  core | skylarkjs-core.js | not included skylark-utils |
| full （development） | uncompressed/skylarkjs.js | included skylark-utils |
| core （development）| uncompressed/skylarkjs-core.js | not included skylark-utils |


### installation
There are multiple ways to install the skylark-router library. 
- cdn  
http://registry.skylarkjs.org/packages/skylarkjs/v0.9.3/skylarkjs.js    or  
http://registry.skylarkjs.org/packages/skylarkjs/v0.9.3/uncompressed/skylarkjs.js 
- bower  
bower install skylarkjs
- skylark.js development tool  

### usage

- Using the skylarkjs library for a AMD module.  
```js
<script type="text/javascript" 
            src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js"
            data-main="http://registry.skylarkjs.org/packages/skylarkjs/v0.9.3/uncompressed/skylarkjs.js">
</script>
<script>
  require(["skylarkjs"],funciton(skylarkjs){
  skylarkjs.xxx();
  });
</script>
```

## Developping

### installation
Skylark.js sdk is released as npm package, so first make sure the nodejs and npm have been installed.
```js
npm install skylarkjs -g
```
### quick start
- enter into the workspace root directory  
- create skylark slax application skeleton  
```js
sjs create slaxApp1 --routes home:/,view1:/view1,view2:/view2
```
- build application  
```js
npm run build
```
- deploy application  
```js
npm run deploy
```
- run the application as desktop application  
```js
npm run browse
```
- start server to run the slax application  
```js
npm run serve
```  

## Bugs and feature requests

Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/skylarkjs/skylark/issues/new).

## License

The code is released under the [MIT License](https://github.com/skylarkjs/skylark/blob/master/LICENSE).



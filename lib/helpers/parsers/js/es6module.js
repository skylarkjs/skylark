'use strict';
///@buxlabs/gulp-es6-to-amd

const _ = require('underscore');
const AbstractSyntaxTree = require('./ast');
const path = require('path');
const array = {
    identifier (array,source) {

      let moduleName = "m_" + path.basename(source);
      if (array.indexOf(moduleName)==-1) {
        return moduleName;
      }

      let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
      let index = 0
      while (array.indexOf(moduleName + "_" + alphabet[index]) !== -1) {
        index += 1
        if (index === alphabet.length) {
          index = 0
          alphabet = alphabet.map(character => '_' + character)
        }
      }
      return moduleName + "_" + alphabet[index];
    }

};

class Es6Module extends AbstractSyntaxTree {

    convert () {
        if (this.has('ImportDeclaration')) {
            this.convertCodeWithImportDeclarations();
        } else if (this.has('ExportDefaultDeclaration')) {
            this.convertExportDefaultDeclarationToDefine();
        } else if (this.has('ExportNamedDeclaration')) {
            this.convertExportNamedDeclarationToDefine();
        }
    }
    
    convertCodeWithImportDeclarations () {
        var pairs = this.getDependencyPairs();

        this.remove({ type: 'ImportDeclaration' });
        ///this.normalizePairs(pairs);
        if (this.has('ExportDefaultDeclaration')) {
            this.convertExportDefaultDeclarationToReturn();
        } else if (this.has('ExportNamedDeclaration')) {
            this.convertExportNamedDeclarations();
        }
        this.normalizePairs(pairs);
        this.prependUseStrictLiteral();
        this.wrapWithDefineWithArrayExpression(pairs);
    }
    
    prependUseStrictLiteral () {
        this.prepend({
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 'use strict'
            }
        });
    }


    isSideEffectImportDeclaration(node) {
        return node.source && node.source.type === 'Literal' && node.specifiers.length === 0;
    }

    getDependencyPairs () {
        var dependencyToIdentifierMap = {};
        var imports = this.find('ImportDeclaration');
        var ids = _.unique(imports.map(item => item.name));
        var result = _.flatten(imports.map(node => {
            if (this.isSideEffectImportDeclaration(node)) {
                return {
                    element: node.source.value
                };
            }

            return node.specifiers.map(function (specifier) {
                if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier') {
                    return this.getLocalSpecifier(node, specifier);
                }
                if (specifier.type === 'ImportSpecifier') {
                    var identifier;
                    var value = node.source.value;
                    if (specifier.imported.name !== specifier.local.name) {
                        return this.getLocalSpecifier(node, specifier);
                    } else if (dependencyToIdentifierMap.hasOwnProperty(value)) {
                        identifier = dependencyToIdentifierMap[value];
                    } else {

                        var identifiers = _.unique(_.flatten(ids)).concat(Object.values(dependencyToIdentifierMap));
                        identifier = array.identifier(identifiers,node.source.value);
                        dependencyToIdentifierMap[value] = identifier;
                    }
                    return {
                        element: node.source.value,
                        param: identifier,
                        name: specifier.local.name
                    };
                }
            }.bind(this));
        }));
        return result;
    }
    
    getLocalSpecifier (node, specifier) {
        return {
            element: node.source.value,
            param: specifier.local.name
        };
    }
    
    convertExportNamedDeclarations () {
        var declarations = this.find('ExportNamedDeclaration');
        this.convertExportNamedDeclarationToDeclaration();
        this.remove({ type: 'ExportNamedDeclaration' });
        this.append({
            type: 'ReturnStatement',
            argument: this.getObjectExpression(declarations)
        });
    }
    
    convertExportNamedDeclarationToDeclaration () {
        this.replace({
            enter: function (node) {
                if (node.type === 'ExportNamedDeclaration' && node.declaration) {
                    return node.declaration;
                }
            }
        });
    }

    convertExportDefaultDeclarationToDefine () {
        this.prependUseStrictLiteral();
        this.convertExportDefaultDeclarationToReturn();
        this.wrap(body => {
            return [this.getDefineWithFunctionExpression(body)];
        });
    }
    
    getDefineWithFunctionExpression (body) {
        return this.getDefine([this.getFunctionExpression([], body)]);
    }
    
    convertExportDefaultDeclarationToReturn () {
        this.replace({
            enter: node => {
                if (node.type === 'ExportDefaultDeclaration') {
                    node.type = 'ReturnStatement';
                    node.argument = node.declaration;
                    return node;
                }
            }
        });

    }
    
    getDefine (nodes) {
        return {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'define' },
                arguments: nodes
            }
        };
    }
    
    convertExportNamedDeclarationToDefine () {
        this.prependUseStrictLiteral();
        this.convertExportNamedDeclarations();
        this.wrap(body => {
            return [this.getDefineWithFunctionExpression(body)];
        });
    }
    
    getFunctionExpression (params, body) {
        return {
            type: 'FunctionExpression',
            params: params,
            body: {
                type: 'BlockStatement',
                body: body
            }
        };
    }
    
    getProperty (node, shorthand) {
        return {
            type: "Property",
            key: node,
            value: node,
            shorthand: shorthand,
            kind: "init"
        };
    }
    
    getObjectExpression (declarations) {
        return {
            "type": "ObjectExpression",
            "properties": this.mapDeclarationsToProperties(declarations)
        };
    }
    
    mapDeclarationsToProperties (declarations) {
        return _.flatten(declarations.map(this.mapDeclarationToProperty.bind(this)));
    }
    
    mapDeclarationToProperty (declaration) {
        if (!declaration.declaration && declaration.specifiers) {
            return declaration.specifiers.map(node => {
                return this.getProperty(node.local, true);
            });
        }
        if (declaration.declaration.type === "VariableDeclaration") {
            return declaration.declaration.declarations.map(node => {
                return this.getProperty(node.id);
            });
        }
        return this.getProperty(declaration.declaration.id);
    }

    normalizePairs (pairs) {
        /*
        let nodes = pairs.filter(pair => !!pair.name);
        let names = nodes.map(node => node.name);
        this.replace({
            leave: (current, parent) => {
                if (current.type === 'Identifier') {
                    let index = names.indexOf(current.name);
                    if (index !== -1) {
                        let pair = nodes[index];
                        return this.convertIdentifierToMemberExpression(pair);
                    }
                }
                return current;
            }
        });
        */
        let namedImports = [];

        pairs.forEach((pair)=>{
            if (pair.name) {
                let namedImport = namedImports[pair.param] || {
                    paramName : pair.param,
                    variableNames : []
                };
                if (!namedImports[pair.param]) {
                    namedImports.push(namedImports[pair.param] = namedImport);
                }
                namedImport.variableNames.push(pair.name);                
            }
        });

        namedImports = namedImports.reverse();

        namedImports.forEach((namedImport)=>{
            let variableDeclaration = {
              "type": "VariableDeclaration",
              "declarations": [
                {
                  "type": "VariableDeclarator",
                  "id": {
                    "type": "ObjectPattern",
                    "properties": [
                    ]
                  },
                  "init": {
                    "type": "Identifier",
                    "name": namedImport.paramName
                  }
                }
              ],
              "kind": "const"
            };

            namedImport.variableNames.forEach((variableName)=>{
                variableDeclaration.declarations[0].id.properties.push({
                    "type": "Property",
                    "key": {
                      "type": "Identifier",
                      "name": variableName
                    },
                    "computed": false,
                    "value": {
                      "type": "Identifier",
                      "name": variableName
                    },
                    "kind": "init",
                    "method": false,
                    "shorthand": true
                });
            });

            this.prepend(variableDeclaration);
        });


    }
    
    convertIdentifierToMemberExpression(pair, current) {
        return {
            type: 'MemberExpression',
            object: {
                type: 'Identifier',
                name: pair.param
            },
            property: {
                type: 'Identifier',
                name: pair.name
            }
        };
    }
    
    getArrayExpression (elements) {
        return { type: 'ArrayExpression', elements: elements };
    }

    wrapWithDefineWithArrayExpression (pairs) {
        pairs = _.unique(pairs, item => item.element + item.param);
        var elements = pairs.map(pair => pair.element)
        .map(function (element) {
            return { type: 'Literal', value: element };
        });
        var params = pairs.filter(pair => pair.param).map(pair => pair.param)
        .map(function(param) {
            return { type: 'Identifier', name: param };
        });

        this.wrap(body => {
            return [this.getDefine([
                this.getArrayExpression(elements),
                this.getFunctionExpression(params, body)
            ])];
        });
    }

}

Es6Module.converter = function converter (source) {
    if (source.indexOf('import') === -1 && source.indexOf('export') === -1) { return source; }
    var m = new Es6Module(source);
    m.convert();
    return m.toSource();
};


module.exports = Es6Module;

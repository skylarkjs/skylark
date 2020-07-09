'use strict';

const _ = require('underscore');
const AbstractSyntaxTree = require('./ast');

class CjsModule extends AbstractSyntaxTree {

    convert () {
        var pairs = this.getDependencyPairs();
        this.replaceRequireMark(pairs);
        this.removeOriginUseStrictLiteral();
        this.prependFakeExports();
        this.prependUseStrictLiteral();
        this.appendReturn();
        this.wrapWithDefineWithArrayExpression(pairs);
    }

    replaceRequireMark(pairs) {
        var self = this;
        pairs.forEach(function (outNode, index) {
            self.replace({
                enter: function (node) {
                    if (node.type === 'CallExpression' && node.callee.name == 'require' &&
                        node['arguments'][0].value == outNode['arguments'][0].value) {
                        return self.getIdentifier(self.getModuleName(index));
                    }
                }
            });
        });
    }

    removeOriginUseStrictLiteral(){
        this.remove({
            "type": "ExpressionStatement",
            "expression": {
                "type": "Literal",
                "value": "use strict"
            }
        });
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

    prependFakeExports() {
        // var module = {exports: {}};
        this.prepend({
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "module"
                    },
                    "init": {
                        "type": "ObjectExpression",
                        "properties": [
                            {
                                "type": "Property",
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                    "type": "Identifier",
                                    "name": "exports"
                                },
                                "value": {
                                    "type": "ObjectExpression",
                                    "properties": []
                                },
                                "kind": "init"
                            }
                        ]
                    }
                }
            ],
            "kind": "var"
        });
        // var exports = {};
        this.prepend({
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "exports"
                    },
                    "init": {
                        "type": "ObjectExpression",
                        "properties": []
                    }
                }
            ],
            "kind": "var"
        });
    }

    appendReturn() {
        //function __isEmptyObject(obj) {
        //    var attr;
        //    for (attr in obj)
        //        return !1;
        //    return !0
        //}
        this.append({
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": "__isEmptyObject"
            },
            "generator": false,
            "expression": false,
            "params": [
                {
                    "type": "Identifier",
                    "name": "obj"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "VariableDeclaration",
                        "declarations": [
                            {
                                "type": "VariableDeclarator",
                                "id": {
                                    "type": "Identifier",
                                    "name": "attr"
                                },
                                "init": null
                            }
                        ],
                        "kind": "var"
                    },
                    {
                        "type": "ForInStatement",
                        "left": {
                            "type": "Identifier",
                            "name": "attr"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "obj"
                        },
                        "body": {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "UnaryExpression",
                                "operator": "!",
                                "prefix": true,
                                "argument": {
                                    "type": "Literal",
                                    "value": 1
                                }
                            }
                        }
                    },
                    {
                        "type": "ReturnStatement",
                        "argument": {
                            "type": "UnaryExpression",
                            "operator": "!",
                            "prefix": true,
                            "argument": {
                                "type": "Literal",
                                "value": 0
                            }
                        }
                    }
                ]
            }
        });
        //function __isValidToReturn(obj) {
        //    return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
        //}
        this.append({
            "type": "FunctionDeclaration",
            "id": {
                "type": "Identifier",
                "name": "__isValidToReturn"
            },
            "generator": false,
            "expression": false,
            "params": [
                {
                    "type": "Identifier",
                    "name": "obj"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "ReturnStatement",
                        "argument": {
                            "type": "LogicalExpression",
                            "left": {
                                "type": "LogicalExpression",
                                "left": {
                                    "type": "BinaryExpression",
                                    "left": {
                                        "type": "UnaryExpression",
                                        "operator": "typeof",
                                        "prefix": true,
                                        "argument": {
                                            "type": "Identifier",
                                            "name": "obj"
                                        }
                                    },
                                    "operator": "!=",
                                    "right": {
                                        "type": "Literal",
                                        "value": "object"
                                    }
                                },
                                "operator": "||",
                                "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "MemberExpression",
                                        "object": {
                                            "type": "Identifier",
                                            "name": "Array"
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "isArray"
                                        },
                                        "computed": false
                                    },
                                    "arguments": [
                                        {
                                            "type": "Identifier",
                                            "name": "obj"
                                        }
                                    ]
                                }
                            },
                            "operator": "||",
                            "right": {
                                "type": "UnaryExpression",
                                "operator": "!",
                                "prefix": true,
                                "argument": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "Identifier",
                                        "name": "__isEmptyObject"
                                    },
                                    "arguments": [
                                        {
                                            "type": "Identifier",
                                            "name": "obj"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                ]
            }
        });
        //if (__isValidToReturn(module.exports)) return module.exports;
        //else if (__isValidToReturn(exports)) return exports;
        this.append({
            "type": "IfStatement",
            "test": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "__isValidToReturn"
                },
                "arguments": [
                    {
                        "type": "MemberExpression",
                        "object": {
                            "type": "Identifier",
                            "name": "module"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "exports"
                        },
                        "computed": false
                    }
                ]
            },
            "consequent": {
                "type": "ReturnStatement",
                "argument": {
                    "type": "MemberExpression",
                    "object": {
                        "type": "Identifier",
                        "name": "module"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "exports"
                    },
                    "computed": false
                }
            },
            "alternate": {
                "type": "IfStatement",
                "test": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "Identifier",
                        "name": "__isValidToReturn"
                    },
                    "arguments": [
                        {
                            "type": "Identifier",
                            "name": "exports"
                        }
                    ]
                },
                "consequent": {
                    "type": "ReturnStatement",
                    "argument": {
                        "type": "Identifier",
                        "name": "exports"
                    }
                },
                "alternate": null
            }
        });
    }
    
    getModuleName (index) {
        return '__module__' + index;
    }

    getIdentifier(name) {
        return {
            type: "Identifier",
            name: name
        }
    }

    getDependencyPairs () {
        var requires = _.filter(this.find('CallExpression'), item => {
            return item.callee.name == 'require';
        });
        return _.unique(_.flatten(requires), pair => pair['arguments'][0].value);
    }
    
    getDefineWithFunctionExpression (body) {
        return this.getDefine([this.getFunctionExpression([], body)]);
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
        return _.flatten(declarations.map(declaration => {
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
        }));
    }
    
    getArrayExpression (elements) {
        return { type: 'ArrayExpression', elements: elements };
    }

    wrapWithDefineWithArrayExpression (pairs) {
        var self = this;
        var elements = pairs.map(function (pair, index) {
            return { type: 'Literal', value: pair['arguments'][0].value };
        });
        var params = pairs.map(function(pair, index) {
            return { type: 'Identifier', name: self.getModuleName(index) };
        });
        this.wrap(body => {
            return [this.getDefine([
                this.getArrayExpression(elements),
                this.getFunctionExpression(params, body)
            ])];
        });
    }

}

CjsModule.converter = function converter (source) {
    if (source.indexOf('require') === -1 && source.indexOf('exports') === -1) { return source; }
    var module = new CjsModule(source);
    module.convert();
    return module.toSource();
};

module.exports = CjsModule;
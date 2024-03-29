'use strict'

const espree = require('espree'); //require("./esprima"); //require('espree')
const esquery =  require('esquery'); /// require('esquery-jsx/jsx') //require('esquery')
const escodegen = require('escodegen')
const estraverse = require('estraverse')
const template = require('estemplate')
const comparify = require('comparify')
const toAST = require('to-ast')
const prettier = require('prettier')

class AbstractSyntaxTree {
  constructor (source, options) {
    options = options || {}
    if (typeof source === 'string') {
      this.source = source;
      this.ast = this.constructor.parse(source, {
        attachComment: options.comments,
        comment: options.comments,
        loc: true,
        ecmaVersion : 'latest', //10
        ecmaFeatures: {
          // enable parsing of arrow functions
          arrowFunctions: true,
   
          // enable parsing of let/const
          blockBindings: true,
   
          // enable parsing of destructured arrays and objects
          destructuring: true,
   
          // enable parsing of regular expression y flag
          regexYFlag: true,
   
          // enable parsing of regular expression u flag
          regexUFlag: true,
   
          // enable parsing of template strings
          templateStrings: true,
   
          // enable parsing of binary literals
          binaryLiterals: true,
   
          // enable parsing of ES6 octal literals
          octalLiterals: true,
   
          // enable parsing unicode code point escape sequences
          unicodeCodePointEscapes: true,
   
          // enable parsing of default parameters
          defaultParams: true,
   
          // enable parsing of rest parameters
          restParams: true,
   
          // enable parsing of for-of statement
          forOf: true,
   
          // enable parsing computed object literal properties
          objectLiteralComputedProperties: true,
   
          // enable parsing of shorthand object literal methods
          objectLiteralShorthandMethods: true,
   
          // enable parsing of shorthand object literal properties
          objectLiteralShorthandProperties: true,
   
          // Allow duplicate object literal properties (except '__proto__')
          objectLiteralDuplicateProperties: true,
   
          // enable parsing of generators/yield
          generators: true,
   
          // enable parsing spread operator
          spread: true,
   
          // enable super in functions
          superInFunctions: true,
   
          // enable parsing classes
          classes: true,
   
          // enable parsing of modules
          modules: true,
   

          // enable return in global scope
          globalReturn: true,

          jsx: false //options.jsx
        },
        sourceType: 'module'
      })
    } else {
      this.ast = source
    }
  }

  query (node, selector) {
    return esquery(node, selector)
  }

  find (selector, options) {
    return this.query(this.ast, selector, options)
  }

  each (selector, callback) {
    return this.find(selector).forEach(callback)
  }

  first (selector) {
    return this.find(selector)[0]
  }

  last (selector) {
    var nodes = this.find(selector)
    return nodes[nodes.length - 1]
  }

  count (selector) {
    return this.find(selector).length
  }

  has (selector) {
    return this.count(selector) > 0
  }

  is (node, expected) {
    return comparify(node, expected)
  }

  remove (target, options) {
    options = options || {}
    if (typeof target === 'string') {
      return this.removeBySelector(target, options)
    }
    this.removeByNode(target, options)
  }

  removeBySelector (target, options) {
    var nodes = this.find(target)
    // this could be improved by traversing once and
    // comparing the current node to the found nodes
    // one by one while making the array of nodes smaller too
    nodes.forEach(node => this.removeByNode(node, options))
  }

  removeByNode (node, options) {
    var count = 0
    estraverse.replace(this.ast, {
      enter: function (current, parent) {
        if (options.first && count === 1) {
          return this.break()
        }
        if (comparify(current, node)) {
          count += 1
          return this.remove()
        }
      },
      leave: function (current, parent) {
        if (current.expression === null ||
                  (current.type === 'VariableDeclaration' && current.declarations.length === 0)) {
          return this.remove()
        }
      }
    })
  }

  walk (callback) {
    return estraverse.traverse(this.ast, { enter: callback })
  }

  traverse (options) {
    return estraverse.traverse(this.ast, options)
  }

  replace (options) {
    return estraverse.replace(this.ast, options)
  }

  prepend (node) {
    this.ast.body.unshift(node)
  }

  append (node) {
    this.ast.body.push(node)
  }

  wrap (callback) {
    this.ast.body = callback(this.ast.body)
  }

  unwrap () {
    let block = this.first('BlockStatement')
    this.ast.body = block.body
  }

  template (source, options) {
    options = options || {}
    if (typeof source === 'string') {
      return template(source, options).body
    }
    return toAST(source, options)
  }

  beautify (source, options) {
    return prettier.format(source, options)
  }

  mark () {
    let cid = 1
    this.walk(node => {
      node.cid = cid
      cid += 1
    })
  }

  minify (ast) {
    return ast
  }

  toSource (options) {
    options = options || {}

    if (options.minify) {
      this.ast = this.minify(this.ast)
    }

    var source = this.constructor.generate(this.ast, {
      comment: options.comments,
      format: {
        quotes: options.quotes || 'auto'
      }
    })

    if (options.beautify) {
      source = this.beautify(source, options.beautify)
    }

    var map
    if (options.sourceMap) {
      map = this.toSourceMap(options)
    }

    this.source = source

    if (map) { return { map, source } }
    return source
  }

  toSourceMap (options) {
    const source = this.source
    return this.constructor.generate(this.ast, {
      sourceMap: options.sourceFile || 'UNKNOWN',
      sourceMapRoot: options.sourceRoot || '',
      sourceContent: source,
      comment: options.comments
    })
  }

  toString (options) {
    return this.toSource(options)
  }

  static generate (ast, options) {
    return escodegen.generate(ast, options)
  }

  static parse (source, options) {
    return espree.parse(source, options)
  }

  static walk (node, callback) {
    return estraverse.traverse(node, { enter: callback })
  }
}

module.exports = AbstractSyntaxTree

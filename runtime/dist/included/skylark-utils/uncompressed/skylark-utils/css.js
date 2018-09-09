define([
    "./skylark",
    "./langx",
    "./noder"
], function(skylark, langx, noder) {

    var head = document.getElementsByTagName("head")[0],
        count = 0,
        sheetsByUrl = {},
        sheetsById = {},
        defaultSheetId = _createStyleSheet(),
        defaultSheet = sheetsById[defaultSheetId],
        rulesPropName = ("cssRules" in defaultSheet) ? "cssRules" : "rules",
        insertRuleFunc,
        deleteRuleFunc = defaultSheet.deleteRule || defaultSheet.removeRule;

    if (defaultSheet.insertRule) {
        var _insertRule = defaultSheet.insertRule;
        insertRuleFunc = function(selector, css, index) {
            _insertRule.call(this, selector + "{" + css + "}", index);
        };
    } else {
        insertRuleFunc = defaultSheet.addRule;
    }

    function normalizeSelector(selectorText) {
        var selector = [],
            last, len;
        last = defaultSheet[rulesPropName].length;
        insertRuleFunc.call(defaultSheet, selectorText, ';');
        len = defaultSheet[rulesPropName].length;
        for (var i = len - 1; i >= last; i--) {
            selector.push(_sheet[_rules][i].selectorText);
            deleteRuleFunc.call(defaultSheet, i);
        }
        return selector.reverse().join(', ');
    }

    /*
     * create a stylesheet element.
     * @param {Boolean} external
     * @param {Object} options
     * @param {String} [options.media = null]
     */
    function _createStyleSheet(external,options ) {
        var node,
            props = {
                type : "text/css"
            },
            id = (count++);

        options = options || {};
        if (options.media) {
            props.media = options.media;
        }

        if (external) {
            node = noder.create("link",langx.mixin(props,{
                rel  : "stylesheet",
                async : false
            }));
        } else {
            node = noder.createElement("style",props);
        }

        noder.append(head,node);
        sheetsById[id] = {
            id : id,
            node :node
        };

        return id;
    }

    function createStyleSheet(css,options) {
        if (!options) {
            options = {};
        }
        var sheetId = _createStyleSheet(false,options);
        if (css) {
            addSheetRules(sheetId,css);
        }

        return sheetId;
    }

    function loadStyleSheet(url, options) {
        var sheet = sheetsByUrl[url];
        if (!sheet) {
            var sheetId = _createStyleSheet(true,options);

            sheet = sheetsByUrl[url] = sheetsById[sheetId];
            langx.mixin(sheet,{
                state: 0, //0:unload,1:loaded,-1:loaderror
                url : url,
                deferred : new langx.Deferred()
            });

            var node = sheet.node;

            startTime = new Date().getTime();

            node.onload = function() {
                sheet.state = 1;
                sheet.deferred.resolve(sheet.id);
            },
            node.onerror = function(e) {
                sheet.state = -1;
                sheet.deferred.reject(e);
            };

            node.href = sheet.url;
        }
        return sheet.deferred.promise;
    }

    function deleteSheetRule(sheetId, rule) {
        var sheet = sheetsById[sheetId];
        if (langx.isNumber(rule)) {
            deleteRuleFunc.call(sheet, rule);
        } else {
            langx.each(sheet[rulesPropName], function(i, _rule) {
                if (rule === _rule) {
                    deleteRuleFunc.call(sheet, i);
                    return false;
                }
            });
        }
        return this;
    }

    function deleteRule(rule) {
        deleteSheetRule(defaultSheetId, rule);
        return this;
    }

    function removeStyleSheet(sheetId) {
        if (sheetId === defaultSheetId) {
            throw new Error("The default stylesheet can not be deleted");
        }
        var sheet = sheetsById[sheetId];
        delete sheetsById[sheetId];

        noder.remove(sheet.node);
        return this;
    }

    /*
     * insert a rule to the default stylesheet.
     * @param {String} selector
     * @param {String} css
     * @param {Number} index 
     */
    function insertRule(selector, css, index) {
        return this.insertSheetRule(defaultSheetId, selector, css, index);
    }

    /*
     * Add rules to the default stylesheet.
     * @param {Object} rules
     */
    function addRules(rules) {
        return this.addRules(defaultSheetId,rules);
    }

    /*
     * insert a rule to the stylesheet specified by sheetId.
     * @param {Number} sheetId  
     * @param {String} selector
     * @param {String} css
     * @param {Number} index 
     */
    function insertSheetRule(sheetId, selector, css, index) {
        if (!selector || !css) {
            return -1;
        }

        var sheet = sheetsById[sheetId];
        index = index || sheet[rulesPropName].length;

        return insertRuleFunc.call(sheet, selector, css, index);
    }

    /*
     * Add  rules to stylesheet.
     * @param {Number} sheetId  
     * @param {Object|String} rules
     * @return this
     * @example insertSheetRules(sheetId,{
     * 
     * });
     */
    function addSheetRules(sheetId,rules) {
        var sheet = sheetsById[sheetId],
            css;
        if (langx.isString(rules)) {
            css = rules;
        } else {
            css = toString(rules);
        }

        noder.append(sheet.node,noder.createTextNode(css));
        
        return this;
    }

    function isAtRule(str) {
        return str.startsWith("@");
    }

    function toString(json){
        var adjust = function(parentName,name,depth) {
            if (parentName) {
                if (isAtRule(parentName)) {
                    depth += 1;
                } else {
                    name =  parentName + " " + name;
                }                
            }
            return {
                name : name,
                depth : depth
            }
        };

        var strNode = function (name, values, depth) {
            var str = "",
                atFlg = isAtRule(name);


            if (isAtRule(name)) {
                // at rule
                if (langx.isString(values)) {
                    // an at rule without block
                    // ex: (1) @charset 'utf8';
                    str = css.SPACE.repeat(depth) + name.trim() + " \"" + values.trim() + " \";\n";
                } else {
                    // an at rule with block, ex :
                    //  @media 'screen' {
                    //  }
                    str += css.SPACE.repeat(depth) + name.trim() + " {\n";
                    str += strNode("",values,depth+1);
                    str += css.SPACE.repeat(depth) + " }\n";
                }
            } else {
                // a selector or a property
                if (langx.isString(values)) {
                    // a css property 
                    // ex : (1) font-color : red;
                    str = css.SPACE.repeat(depth) + name.trim() ;
                    if (atFlg) {
                        str = str +  " \"" + values.trim() + " \";\n";
                    } else {
                        str = str + ': ' + values.trim() + ";\n";
                    }

                } else {
                    // a selector rule 
                    // ex : (1) .class1 : {
                    //            font-color : red;
                    //          }
                    if (langx.isArray(values)) {
                        // array for ordering
                        for (var n =0; n<values.length; n ++) {
                           str +=  strNode(name,values[n],depth);
                        }
                    } else {
                        // plain object

                        if (name) {
                            str += css.SPACE.repeat(depth) + name.trim() + " {\n";

                            for (var n in values) {
                                var value =values[n];
                                if (langx.isString(value)) {
                                    // css property
                                    str += strNode(n,value,depth+1)
                                }
                            }

                            str += css.SPACE.repeat(depth) + "}\n";
                        }

                        for (var n in values) {
                            var value =values[n];
                            if (!langx.isString(value)) {
                                var adjusted = adjust(name,n,depth);
                                str +=  strNode(adjusted.name,value,adjusted.depth);
                            } 
                        }

                    }
                }
            }   

            return str;
        };


        return strNode("",json,0);
    }
 

    function css() {
        return css;
    }

    langx.mixin(css, {
        SPACE : "\t",

        addRules : addRules,

        addSheetRules : addSheetRules,

        createStyleSheet: createStyleSheet,

        deleteSheetRule : deleteSheetRule,

        deleteRule : deleteRule,

        insertRule : insertRule,

        insertSheetRule : insertSheetRule,

        removeStyleSheet : removeStyleSheet,

        toString : toString
    });

    return skylark.css = css;
});

define([
    "./skylark",
    "./langx",
    "./noder"
], function(skylark, langx, construct) {

    var head = document.getElementsByTagName("head")[0],
        count = 0,
        sheetsByUrl = {},
        sheetElementsById = {},
        defaultSheetId = _createStyleSheet(),
        defaultSheet = sheetElementsById[defaultSheetId],
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

    function _createStyleSheet() {
        var link = document.createElement("link"),
            id = (count++);

        link.rel = "stylesheet";
        link.type = "text/css";
        link.async = false;
        link.defer = false;

        head.appendChild(link);
        sheetElementsById[id] = link;

        return id;
    }

    function css() {
        return css;
    }

    langx.mixin(css, {
        createStyleSheet: function(cssText) {
            return _createStyleSheet();
        },

        loadStyleSheet: function(url, loadedCallback, errorCallback) {
            var sheet = sheetsByUrl[url];
            if (!sheet) {
                sheet = sheetsByUrl[url] = {
                    state: 0, //0:unload,1:loaded,-1:loaderror
                    loadedCallbacks: [],
                    errorCallbacks: []
                };
            }

            sheet.loadedCallbacks.push(loadedCallback);
            sheet.errorCallbacks.push(errorCallback);

            if (sheet.state === 1) {
                sheet.node.onload();
            } else if (sheet.state === -1) {
                sheet.node.onerror();
            } else {
                sheet.id = _createStyleSheet();
                var node = sheet.node = sheetElementsById[sheet.id];

                startTime = new Date().getTime();

                node.onload = function() {
                    sheet.state = 1;
                    sheet.state = -1;
                    var callbacks = sheet.loadedCallbacks,
                        i = callbacks.length;

                    while (i--) {
                        callbacks[i]();
                    }
                    sheet.loadedCallbacks = [];
                    sheet.errorCallbacks = [];
                },
                node.onerror = function() {
                    sheet.state = -1;
                    var callbacks = sheet.errorCallbacks,
                        i = callbacks.length;

                    while (i--) {
                        callbacks[i]();
                    }
                    sheet.loadedCallbacks = [];
                    sheet.errorCallbacks = [];
                };

                node.href = sheet.url = url;

                sheetsByUrl[node.url] = sheet;

            }
            return sheet.id;
        },

        deleteSheetRule: function(sheetId, rule) {
            var sheet = sheetElementsById[sheetId];
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
        },

        deleteRule: function(rule) {
            this.deleteSheetRule(defaultSheetId, rule);
            return this;
        },

        removeStyleSheet: function(sheetId) {
            if (sheetId === defaultSheetId) {
                throw new Error("The default stylesheet can not be deleted");
            }
            var sheet = sheetElementsById[sheetId];
            delete sheetElementsById[sheetId];


            construct.remove(sheet);
            return this;
        },

        findRules: function(selector, sheetId) {
            //return array of CSSStyleRule objects that match the selector text
            var rules = [],
                filters = parseSelector(selector);
            $(document.styleSheets).each(function(i, styleSheet) {
                if (filterStyleSheet(filters.styleSheet, styleSheet)) {
                    $.merge(rules, $(styleSheet[_rules]).filter(function() {
                        return matchSelector(this, filters.selectorText, filters.styleSheet === "*");
                    }).map(function() {
                        return normalizeRule($.support.nativeCSSStyleRule ? this : new CSSStyleRule(this), styleSheet);
                    }));
                }
            });
            return rules.reverse();
        },

        insertRule: function(selector, css, index) {
            return this.insertSheetRule(defaultSheetId, selector, css, index);
        },

        insertSheetRule: function(sheetId, selector, css, index) {
            if (!selector || !css) {
                return -1;
            }

            var sheet = sheetElementsById[sheetId];
            index = index || sheet[rulesPropName].length;

            return insertRuleFunc.call(sheet, selector, css, index);

        }
    });

    return skylark.css = css;
});

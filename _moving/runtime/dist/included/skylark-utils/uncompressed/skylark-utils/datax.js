define([
    "./skylark",
    "./langx",
    "./finder"
], function(skylark, langx, finder) {
    var map = Array.prototype.map,
        filter = Array.prototype.filter,
        camelCase = langx.camelCase,
        deserializeValue = langx.deserializeValue,

        capitalRE = /([A-Z])/g,
        propMap = {
            'tabindex': 'tabIndex',
            'readonly': 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            'maxlength': 'maxLength',
            'cellspacing': 'cellSpacing',
            'cellpadding': 'cellPadding',
            'rowspan': 'rowSpan',
            'colspan': 'colSpan',
            'usemap': 'useMap',
            'frameborder': 'frameBorder',
            'contenteditable': 'contentEditable'
        };
    /*
     * Set property values
     * @param {Object} elm  
     * @param {String} name
     * @param {String} value
     */

    function setAttribute(elm, name, value) {
        if (value == null) {
            elm.removeAttribute(name);
        } else {
            elm.setAttribute(name, value);
        }
    }

    function aria(elm, name, value) {
        return this.attr(elm, "aria-" + name, value);
    }

    /*
     * Set property values
     * @param {Object} elm  
     * @param {String} name
     * @param {String} value
     */

    function attr(elm, name, value) {
        if (value === undefined) {
            if (typeof name === "object") {
                for (var attrName in name) {
                    attr(elm, attrName, name[attrName]);
                }
                return this;
            } else {
                if (elm.hasAttribute && elm.hasAttribute(name)) {
                    return elm.getAttribute(name);
                }
            }
        } else {
            elm.setAttribute(name, value);
            return this;
        }
    }


    /*
     *  Read all "data-*" attributes from a node
     * @param {Object} elm  
     */

    function _attributeData(elm) {
        var store = {}
        langx.each(elm.attributes || [], function(i, attr) {
            if (attr.name.indexOf('data-') == 0) {
                store[camelCase(attr.name.replace('data-', ''))] = deserializeValue(attr.value);
            }
        })
        return store;
    }

    function _store(elm, confirm) {
        var store = elm["_$_store"];
        if (!store && confirm) {
            store = elm["_$_store"] = _attributeData(elm);
        }
        return store;
    }

    function _getData(elm, name) {
        if (name === undefined) {
            return _store(elm, true);
        } else {
            var store = _store(elm);
            if (store) {
                if (name in store) {
                    return store[name];
                }
                var camelName = camelCase(name);
                if (camelName in store) {
                    return store[camelName];
                }
            }
            var attrName = 'data-' + name.replace(capitalRE, "-$1").toLowerCase()
            return attr(elm, attrName);
        }

    }

    function _setData(elm, name, value) {
        var store = _store(elm, true);
        store[camelCase(name)] = value;
    }


    /*
     * xxx
     * @param {Object} elm  
     * @param {String} name
     * @param {String} value
     */
    function data(elm, name, value) {

        if (value === undefined) {
            if (typeof name === "object") {
                for (var dataAttrName in name) {
                    _setData(elm, dataAttrName, name[dataAttrName]);
                }
                return this;
            } else {
                return _getData(elm, name);
            }
        } else {
            _setData(elm, name, value);
            return this;
        }
    } 
    /*
     * Remove from the element all items that have not yet been run. 
     * @param {Object} elm  
     */

    function cleanData(elm) {
        if (elm["_$_store"]) {
            delete elm["_$_store"];
        }
    }

    /*
     * Remove a previously-stored piece of data. 
     * @param {Object} elm  
     * @param {Array} names
     */
    function removeData(elm, names) {
        if (langx.isString(names)) {
            names = names.split(/\s+/);
        }
        var store = _store(elm, true);
        names.forEach(function(name) {
            delete store[name];
        });
        return this;
    }

    /*
     * xxx 
     * @param {Object} elm  
     * @param {Array} names
     */
    function pluck(nodes, property) {
        return map.call(nodes, function(elm) {
            return elm[property];
        });
    }

    /*
     * Get or set the value of an property for the specified element.
     * @param {Object} elm  
     * @param {String} name
     * @param {String} value
     */
    function prop(elm, name, value) {
        name = propMap[name] || name;
        if (value === undefined) {
            return elm[name];
        } else {
            elm[name] = value;
            return this;
        }
    }

    /*
     * remove Attributes  
     * @param {Object} elm  
     * @param {String} name
     */
    function removeAttr(elm, name) {
        name.split(' ').forEach(function(attr) {
            setAttribute(elm, attr);
        });
        return this;
    }


    /*
     * Remove the value of a property for the first element in the set of matched elements or set one or more properties for every matched element.
     * @param {Object} elm  
     * @param {String} name
     */
    function removeProp(elm, name) {
        name.split(' ').forEach(function(prop) {
            delete elm[prop];
        });
        return this;
    }

    /*   
     * Get the combined text contents of each element in the set of matched elements, including their descendants, or set the text contents of the matched elements.  
     * @param {Object} elm  
     * @param {String} txt
     */
    function text(elm, txt) {
        if (txt === undefined) {
            return elm.textContent;
        } else {
            elm.textContent = txt == null ? '' : '' + txt;
            return this;
        }
    }

    /*   
     * Get the current value of the first element in the set of matched elements or set the value of every matched element.
     * @param {Object} elm  
     * @param {String} value
     */
    function val(elm, value) {
        if (value === undefined) {
            if (elm.multiple) {
                // select multiple values
                var selectedOptions = filter.call(finder.find(elm, "option"), (function(option) {
                    return option.selected;
                }));
                return pluck(selectedOptions, "value");
            } else {
                return elm.value;
            }
        } else {
            elm.value = value;
            return this;
        }
    }

    function datax() {
        return datax;
    }

    langx.mixin(datax, {
        aria: aria,

        attr: attr,

        cleanData: cleanData,

        data: data,

        pluck: pluck,

        prop: prop,

        removeAttr: removeAttr,

        removeData: removeData,

        removeProp: removeProp,

        text: text,

        val: val
    });

    return skylark.datax = datax;
});
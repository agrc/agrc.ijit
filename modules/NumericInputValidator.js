define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',

    'dojo/query',
    'dojo/on',
    'dojo/dom-attr',
    'dojo/dom-class'

], function(
    declare,
    lang,
    array,

    query,
    on,
    domAttr,
    domClass
) {
    // summary:
    //      A module that adds automated validation to <input type='number'> elements.
    return declare('modules/NumericInputValidator', null, {
        // notWithinRangeMsg: String
        notWithinRangeMsg: 'Value must in within {min} and {max}!',

        // notNumberMsg: String
        notNumberMsg: 'Value must be a number!',

        // noDecimalAllowedMsg: String
        noDecimalAllowedMsg: 'Value must be a whole number!',

        // events: Objects[]
        //      Used to clean up events in destroy
        events: null,

        constructor: function() {
            console.log(this.declaredClass + '::constructor', arguments);

            this.events = [];
        },
        init: function (parentNode) {
            // summary:
            //      sets up callbacks for change events
            // parentNode (optional): String | DomNode 
            //      The parent node within which you want to search
            console.log(this.declaredClass + '::init', arguments);
        
            var elements = query('input[type="number"]', parentNode);

            var that = this;
            elements.forEach(function (el) {
                var min = domAttr.get(el, 'min');
                var max = domAttr.get(el, 'max');
                that.events.push(on(el, 'change, keyup', function () {
                    var value = el.value;
                    if (value.length > 0) { // don't valid on empty values
                        that.updateUI(el, that.isValid(value, min, max));
                    } else {
                        that.resetUI(el);
                    }
                }));
            });

            return elements;
        },
        updateUI: function (node, isValid) {
            // summary:
            //      callback for onchange or onkeyup
            // node: DomNode
            // isValid: Boolean | String
            //      true if valid or error message if invalid
            console.log(this.declaredClass + '::updateUI', arguments);
        
            if (isValid !== true) {
                domClass.add(node.parentNode, 'has-error');
                query('.help-block', node.parentNode)[0].innerHTML = isValid;
            } else {
                this.resetUI(node);
            }
        },
        resetUI: function (node) {
            // summary:
            //      resets the UI
            // node: DomNode
            console.log(this.declaredClass + '::resetUI', arguments);
        
            domClass.remove(node.parentNode, 'has-error');
            query('.help-block', node.parentNode)[0].innerHTML = '';
        },
        isValid: function (value, min, max) {
            // summary:
            //      validates the value against the min and max
            // value: String
            // min: Number
            // max: Number
            // returns: Boolean | String
            //      returns true if valid or error message otherwise
            console.log(this.declaredClass + '::isValid', arguments);
        
            // convert values to numbers
            var v = parseFloat(value, 10);
            var mn = parseFloat(min, 10);
            var mx = parseFloat(max, 10);

            // check for NaN
            if (v !== v) { 
                return this.notNumberMsg;
            }

            // check for whole numbers
            var isInteger = function (num) {
                return num % 1 === 0;
            };
            if (isInteger(mn) && isInteger(mx) && !isInteger(v)) {
                return this.noDecimalAllowedMsg;
            }

            // check for range
            if (v >= mn && v <= mx) {
                return true;
            } else {
                return lang.replace(this.notWithinRangeMsg, {min: min, max: max});
            }
        },
        destroy: function () {
            // summary:
            //      cleans up the events
            console.log(this.declaredClass + '::destroy', arguments);
        
            array.forEach(this.events, function (e) {
                e.remove();
            });
        }
    });
});
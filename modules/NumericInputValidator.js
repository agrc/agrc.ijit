define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',

    'dojo/query',
    'dojo/on',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/dom-construct'

], function(
    declare,
    lang,
    array,

    query,
    on,
    domAttr,
    domClass,
    domConstruct
) {
    // summary:
    //      A module that adds automated validation to <input type='number'> elements.
    //
    // description:
    //      Uses `min` and `max` to validate that the value is within a range.
    //      Uses `step` to validate if the value is a whole number or not. Does not
    //      take into account the number of decimal places at the moment.
    //
    //      See NumericInputValidatorTests.html for examples.

    return declare(null, {
        // notWithinRangeMsg: String
        notWithinRangeMsg: 'Value must in within {min} and {max}!',

        // notNumberMsg: String
        notNumberMsg: 'Value must be a number!',

        // noDecimalAllowedMsg: String
        noDecimalAllowedMsg: 'Value must be a whole number!',

        // events: Objects[]
        //      Used to clean up events in destroy
        events: null,

        // _domAttributeName: String
        //      The name of the custom dom attribute used to store the validity
        //      on the input element.
        _domAttributeName: '_isValid',


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
                var step = domAttr.get(el, 'step');
                that.events.push(on(el, 'change, keyup', function () {
                    var value = el.valueAsNumber || el.value;
                    console.log('el.valueAsNumber', el.valueAsNumber);
                    console.log('el.value', el.value);
                    // console.log('el.validity.badInput', el.validity.badInput);
                    if (value.toString().length > 0 || 
                        (el.valueAsNumber !== el.valueAsNumber && el.validity && el.validity.badInput)) { // don't valid on empty values
                        that.updateUI(el, that._isValid(value, min, max, step));
                    } else {
                        that.updateUI(el, true);
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
        
            var helpBlock = query('.help-block', node.parentNode)[0];
            if (!helpBlock) {
                helpBlock = domConstruct.create('p', {'class': 'help-block'}, node.parentNode);
            }
            if (isValid !== true) {
                domClass.add(node.parentNode, 'has-error');
                helpBlock.innerHTML = isValid;
            } else {
                domClass.remove(node.parentNode, 'has-error');
                helpBlock.innerHTML = '';
            }

            // update dom prop
            domAttr.set(node, this._domAttributeName, isValid === true);
        },
        _isValid: function (value, min, max, step) {
            // summary:
            //      validates the value against the min and max
            // value: Number
            // min: String
            // max: String
            // step: String
            // returns: Boolean | String
            //      returns true if valid or error message otherwise
            console.log(this.declaredClass + '::isValid', arguments);
        
            // convert values to numbers
            var v = parseFloat(value, 10);
            var mn = parseFloat(min, 10);
            var mx = parseFloat(max, 10);
            var st = parseFloat(step, 10);

            // check for NaN
            if (v !== v || !/^\d+(\.(\d+)?)?$/.test(value)) { 
                // NaN is only thing that is not equal to itself
                return this.notNumberMsg;
            }

            // check for whole numbers
            var isInteger = function (num) {
                return num % 1 === 0;
            };
            if (((step && isInteger(st)) || !step) && !isInteger(v)) {
                return this.noDecimalAllowedMsg;
            }

            // check for range or no range specified
            if (min === null || max === null || v >= mn && v <= mx) {
                return true;
            } else {
                return lang.replace(this.notWithinRangeMsg, {min: min, max: max});
            }
        },
        isValid: function (node) {
            // summary:
            //      Returns the validity of the passed in node
            // node: Input element
            //      Must match one of the elements that this object queried for in init
            console.log(this.declaredClass + '::isValid', arguments);
        
            return domAttr.get(node, this._domAttributeName);
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
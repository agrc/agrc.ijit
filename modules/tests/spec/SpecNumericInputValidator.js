/* global affix:false */
require([
    'ijit/modules/NumericInputValidator',
    'dojo/dom',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom-attr',
    'dojo/dom-class',

    '/modules/tests/jasmine-fixture.js'
], function(
    NumericInputValidator,
    dom,
    array,
    lang,
    on,
    domAttr,
    domClass
) {
    describe('modules/NumericInputValidator', function() {
        var testObject;
        var elements;
        beforeEach(function() {
            testObject = new NumericInputValidator();
            elements = [
                // [name, min, max, step]
                ['one', '1', '10', '1'],
                ['two', '1.0', '10.0', '0.1']
            ];
            array.forEach(elements, function (el) {
                affix('#group' + el[0] + '.form-group label.control-label+' +
                    'input#' + el[0] + '.form-control[type="number"][min="' + 
                    el[1] + '"][max="' + el[2] + '"][step="' + el[3] + '"]+' + 
                    'p#help' + el[0] + '.help-block');
            });
        });
        afterEach(function() {
            testObject.destroy();
            testObject = null;
        });
        it('create a valid object', function() {
            expect(testObject).toEqual(jasmine.any(NumericInputValidator));
        });
        it('affixes elements to dom for tests', function () {
            expect(dom.byId(elements[0][0])).not.toBeNull();
        });
        describe('init', function () {
            it('gets a list of all of the text boxes', function () {
                expect(testObject.init().length).toEqual(elements.length);
            });
            it('gets a list of all text boxes within the parentNode if passed', function () {
                affix('#parent>input[type="number"]');
                var testObject2 = new NumericInputValidator();

                expect(testObject2.init('parent').length).toBe(1);
            });
            it('wires events', function () {
                var value = 'blah';
                var value2 = 2;
                spyOn(testObject, 'updateUI');
                spyOn(testObject, '_isValid').andReturn(value);
                var el = dom.byId(elements[0][0]);
                el.value = value2;
                testObject.init();
                on.emit(el, 'change', {
                    bubbles: true,
                    cancelable: true
                });
                on.emit(el, 'keyup', {
                    bubbles: true,
                    cancelable: true
                });

                expect(testObject.updateUI.callCount).toBe(2);
                expect(testObject.updateUI)
                    .toHaveBeenCalledWith(el, value);
                expect(testObject._isValid.callCount).toBe(2);
                expect(testObject._isValid)
                    .toHaveBeenCalledWith(value2, elements[0][1], elements[0][2], elements[0][3]);
            });
            it('passes true for valid if the value is empty', function () {
                spyOn(testObject, 'updateUI');
                var el = dom.byId(elements[0][0]);
                testObject.init();
                on.emit(el, 'change', {
                    bubbles: true,
                    cancelable: true
                });

                expect(testObject.updateUI).toHaveBeenCalledWith(el, true);
            });
        });
        describe('_isValid', function () {
            var checks;
            afterEach(function () {
                array.forEach(checks, function (chk) {
                    expect(testObject._isValid(chk[0], chk[1], chk[2], chk[3])).toBe(chk[4]);
                });
            });
            it('check if number is within min and max', function () {
                checks = [
                    // [value, min, max, step, expected]
                    ['1', '1', '10', null, true],
                    ['11', '1', '10', null, lang.replace(testObject.notWithinRangeMsg, 
                        {min: '1', max: '10'})],
                    ['1.4', '1', '10', '0.1', true]
                ];
            });
            it('checks for non-number values', function () {
                checks = [
                    ['a', '1', '10', null, testObject.notNumberMsg],
                    ['1a', null, null, null, testObject.notNumberMsg]
                ];
            });
            it('check for decimal places', function () {
                checks = [
                    ['1.5', '1', '10', null, testObject.noDecimalAllowedMsg]
                ];
            });
            it('if not max or min then dont worry about range validation', function () {
                checks = [
                    ['10', null, null, null, true]
                ];
            });
        });
        describe('updateUI', function () {
            var el;
            beforeEach(function () {
                el = dom.byId(elements[0][0]);
            });
            it('applies error class to form-group if invalid', function () {
                testObject.updateUI(el, 'blah');

                expect(domClass.contains('groupone', 'has-error')).toBe(true);
            });
            it('shows error message', function () {
                var value = 'blah';
                testObject.updateUI(el, value);

                expect(dom.byId('helpone').innerHTML).toBe(value);
            });
            it('removes parent css and clears help text if valid', function () {
                var el = dom.byId(elements[0][0]);
                domClass.add(el.parentNode, 'has-error');
                dom.byId('helpone').innerHTML = 'blah';

                testObject.updateUI(el, true);

                expect(domClass.contains('groupone', 'has-error')).toBe(false);
                expect(dom.byId('helpone').innerHTML).toBe('');
            });
            it('creates the help block if its not their', function () {
                affix('#grouphelp.form-group label.control-label+' +
                    'input#help.form-control[type="number"][min="' + 
                    el[1] + '"][max="' + el[2] + '"]');

                var txt = 'blah';
                var helpEl = dom.byId('help');

                testObject.updateUI(helpEl, txt);
                expect(dom.byId('grouphelp').children[2].innerHTML).toBe(txt);
            });
            it('sets the custom valid dom property', function () {
                testObject.updateUI(el, true);

                expect(domAttr.get(el, testObject._domAttributeName)).toBe(true);

                testObject.updateUI(el, 'blah');

                expect(domAttr.get(el, testObject._domAttributeName)).toBe(false);
            });
        });
        describe('isValid', function () {
            it('returns the value of the custom dom attribute', function () {
                var el = dom.byId('one');
                testObject._isValid(el);
                domAttr.set(el, testObject._domAttributeName, true);

                expect(testObject.isValid(el)).toBe(true);

                domAttr.set(el, testObject._domAttributeName, false);

                expect(testObject.isValid(el)).toBe(false);
            });
        });
    });
});
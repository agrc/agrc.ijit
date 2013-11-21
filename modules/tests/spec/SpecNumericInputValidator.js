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
                ['one', '1', '10'],
                ['two', '1.0', '10.0']
            ];
            array.forEach(elements, function (el) {
                affix('#group' + el[0] + '.form-group label.control-label+' +
                    'input#' + el[0] + '.form-control[type="number"][min="' + 
                    el[1] + '"][max="' + el[2] + '"]+' + 
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
            it('wires events that sets isValid on the dom node', function () {
                var value = 'blah';
                var value2 = '2';
                spyOn(testObject, 'updateUI');
                spyOn(testObject, 'isValid').andReturn(value);
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
                expect(testObject.isValid.callCount).toBe(2);
                expect(testObject.isValid).toHaveBeenCalledWith(value2, elements[0][1], elements[0][2]);
            });
            it('doesnt fire updateUI if the value is empty', function () {
                spyOn(testObject, 'updateUI');
                spyOn(testObject, 'resetUI');
                var el = dom.byId(elements[0][0]);
                testObject.init();
                on.emit(el, 'change', {
                    bubbles: true,
                    cancelable: true
                });

                expect(testObject.updateUI).not.toHaveBeenCalled();
                expect(testObject.resetUI).toHaveBeenCalled();
            });
        });
        describe('isValid', function () {
            var checks;
            afterEach(function () {
                array.forEach(checks, function (chk) {
                    expect(testObject.isValid(chk[0], chk[1], chk[2])).toBe(chk[3]);
                });
            });
            it('check if number is within min and max', function () {
                checks = [
                    // [value, min, max, expected]
                    ['1', '1', '10', true],
                    ['11', '1', '10', lang.replace(testObject.notWithinRangeMsg, 
                        {min: '1', max: '10'})],
                    ['a', '1', '10', testObject.notNumberMsg]
                ];
            });
            it('check for decimal places', function () {
                checks = [
                    ['1.5', '1', '10', testObject.noDecimalAllowedMsg]
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
            it('calls resetUI if valid', function () {
                spyOn(testObject, 'resetUI');

                testObject.updateUI(el, true);

                expect(testObject.resetUI).toHaveBeenCalled();
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
        });
        describe('resetUI', function () {
            it('removes parent css and clears help text', function () {
                var el = dom.byId(elements[0][0]);
                domClass.add(el.parentNode, 'has-error');
                dom.byId('helpone').innerHTML = 'blah';

                testObject.resetUI(el);

                expect(domClass.contains('groupone', 'has-error')).toBe(false);
                expect(dom.byId('helpone').innerHTML).toBe('');
            });
        });
    });
});
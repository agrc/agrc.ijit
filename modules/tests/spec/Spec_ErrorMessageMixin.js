require([
    'dojo/_base/declare',
    'dojo/dom-class',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'ijit/modules/_ErrorMessageMixin'

], function(
    declare,
    domClass,

    _WidgetBase,
    _TemplatedMixin,

    ClassUnderTest
) {
    describe('modules/_ErrorMessageMixin', function() {
        var TestClass = declare([_WidgetBase, _TemplatedMixin, ClassUnderTest], {
            templateString: '<div><div data-dojo-attach-point="errMsg" class="hidden"></div></div>'
        });
        var testObject;

        afterEach(function() {
            if (testObject) {
                if (testObject.destroy) {
                    testObject.destroy();
                }

                testObject = null;
            }
        });

        beforeEach(function() {
            testObject = new TestClass(null);
        });

        describe('Sanity', function() {
            it('should create a _ErrorMessageMixin', function() {
                expect(testObject).toEqual(jasmine.any(TestClass));
            });
        });
        describe('showErrMsg', function () {
            it('makes errMsg div visible', function () {
                testObject.showErrMsg();

                expect(domClass.contains(testObject.errMsg, 'hidden')).toBe(false);
            });
            it('inserts the message text', function () {
                var msg = 'blah';

                testObject.showErrMsg(msg);

                expect(testObject.errMsg.innerHTML).toEqual(msg);
            });
        });
        describe('clearErrMsg', function () {
            it('hides the errMsg div and clears the text', function () {
                domClass.remove(testObject.errMsg, 'hidden');
                testObject.errMsg.innerHTML = 'blah';

                testObject.hideErrMsg();

                expect(domClass.contains(testObject.errMsg, 'hidden')).toBe(true);
                expect(testObject.errMsg.innerHTML).toEqual('');
            });
        });
    });
});
require([
    'ijit/modules/_MustacheTemplateMixin'
],

function (
    _MustacheTemplateMixin
    ) {
    describe('ijit/modules/_MustacheTemplateMixin', function () {
        var testObject;
        beforeEach(function () {
            testObject = new _MustacheTemplateMixin();
        });
        afterEach(function () {
            testObject = null;
        });
        it('create a valid object', function () {
            expect(testObject).toEqual(jasmine.any(_MustacheTemplateMixin));
        });
    });
});
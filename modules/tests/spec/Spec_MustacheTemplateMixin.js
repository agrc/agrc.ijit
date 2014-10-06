require([
    'ijit/modules/_MustacheTemplateMixin'
],

function (
    MustacheTemplateMixin
    ) {
    describe('ijit/modules/_MustacheTemplateMixin', function () {
        var testObject;
        beforeEach(function () {
            testObject = new MustacheTemplateMixin({
                templateString: '<div></div>'
            });
        });
        afterEach(function () {
            testObject = null;
        });
        it('create a valid object', function () {
            expect(testObject).toEqual(jasmine.any(MustacheTemplateMixin));
        });
    });
});
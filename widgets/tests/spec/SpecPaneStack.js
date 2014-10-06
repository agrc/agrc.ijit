require([
    'ijit/widgets/layout/PaneStack',
    'dojo/dom-construct'
],

function (
    TestWidget,
    domConstruct
    ) {
    describe('ijit/widgets/layout/PaneStack', function () {
        var testWidget;
        beforeEach(function () {
            testWidget = new TestWidget({}, domConstruct.create('div', {}, document.body));
            testWidget.startup();
        });
        afterEach(function () {
            testWidget.destroy();
            testWidget = null;
        });

        it('creates a valid object', function () {
            expect(testWidget).toEqual(jasmine.any(TestWidget));
        });
    });
});
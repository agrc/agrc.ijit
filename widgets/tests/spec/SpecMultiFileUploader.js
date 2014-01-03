require([
        'ijit/widgets/upload/MultiFileUploader',
        'dojo/dom-construct',
        'dojo/_base/window'

    ],

    function(
        Uploader,
        domConstruct,
        win
    ) {
        describe('ijit/widgets/upload/MultiFileUploader', function() {
            var testWidget;
            var destroy = function(widget) {
                widget.destroyRecursive();
                widget = null;
            };
            beforeEach(function() {
                testWidget = new Uploader({
                    max: 3
                }, domConstruct.create('div', {}, win.body()));
                testWidget.startup();
            });
            afterEach(function() {
                destroy(testWidget);
            });
            it('create a valid object', function() {
                expect(testWidget).toEqual(jasmine.any(Uploader));
            });
            describe('getData', function() {
                it('creates the max number of file uploads', function() {
                    expect(testWidget._counter).toEqual(1);
                    expect(testWidget._isFull()).toBeFalsy();

                    testWidget._add();
                    expect(testWidget._counter).toEqual(2);
                    expect(testWidget._isFull()).toBeFalsy();

                    testWidget._add();
                    expect(testWidget._counter).toEqual(3);
                    expect(testWidget._isFull()).toBeTruthy();

                    testWidget._add();
                    expect(testWidget._counter).toEqual(3);
                    expect(testWidget._isFull()).toBeTruthy();
                });
            });
        });
    });
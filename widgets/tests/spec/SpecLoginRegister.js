require([
    'ijit/widgets/LoginRegister',
    'dojo/dom-construct',
    'dojo/Deferred',
    'dojo/dom-style',
    'dojo/_base/window',

    // have to preload these for tests since we are creating the widget programmatically
    'ijit/widgets/_LoginRegisterSignInPane',
    'ijit/widgets/_LoginRegisterRequestPane'
],

function (
    LoginRegister,
    domConstruct,
    Deferred,
    domStyle,
    win
    ) {
    describe('ijit/widgets/LoginRegister', function () {
        var testWidget;
        // mock query stuff because I'm too cool to include jquery in my tests :)
        window.$ = function () {
            return { 
                modal: function () {
                    return this;
                },
                on: function () {}
            };
        };
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };
        beforeEach(function () {
            testWidget = new LoginRegister({}, domConstruct.create('div', {}, win.body()));
            testWidget.startup();
        });
        afterEach(function () {
            destroy(testWidget);
        });
        it('create a valid object', function () {
            expect(testWidget).toEqual(jasmine.any(LoginRegister));
        });
        describe('goToPane', function () {
            it("calls selectChild with the appropriate pane", function () {
                spyOn(testWidget.stackContainer, 'selectChild');

                testWidget.goToPane(testWidget.requestPane);

                expect(testWidget.stackContainer.selectChild)
                    .toHaveBeenCalledWith(testWidget.requestPane);
            });
            it("calls focusFirstInput on the pane", function () {
                spyOn(testWidget.signInPane, 'focusFirstInput');

                testWidget.goToPane(testWidget.signInPane);

                expect(testWidget.signInPane.focusFirstInput).toHaveBeenCalled();
            });
        });
    });
});
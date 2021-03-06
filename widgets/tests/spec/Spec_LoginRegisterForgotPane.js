require([
        'ijit/widgets/authentication/_LoginRegisterForgotPane',
        'dojo/dom-construct',
        'dojo/_base/window'

    ],

    function(
        LoginRegisterForgotPane,
        domConstruct,
        win
    ) {
        describe('ijit/widgets/authentication/_LoginRegisterForgotPane', function() {
            var testWidget;
            var destroy = function(widget) {
                widget.destroyRecursive();
                widget = null;
            };
            beforeEach(function() {
                testWidget = new LoginRegisterForgotPane({}, domConstruct.create('div', {}, win.body()));
                testWidget.startup();
            });
            afterEach(function() {
                destroy(testWidget);
            });
            it('create a valid object', function() {
                expect(testWidget).toEqual(jasmine.any(LoginRegisterForgotPane));
            });
            describe('getData', function() {
                it('returns the correct data', function() {
                    var email = 'blah';
                    testWidget.emailTxt.value = email;

                    expect(testWidget.getData()).toEqual({
                        email: email
                    });
                });
            });
            describe('onSubmitReturn', function() {
                it('shows the success msg', function() {
                    spyOn(testWidget, 'showSuccessMsg');

                    testWidget.onSubmitReturn();

                    expect(testWidget.showSuccessMsg).toHaveBeenCalled();
                });
            });
        });
    });
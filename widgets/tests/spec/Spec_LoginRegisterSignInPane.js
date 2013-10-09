require([
    'ijit/widgets/_LoginRegisterSignInPane',
    'dojo/dom-construct',
    'dojo/_base/window'

],

function (
    _LoginRegisterSignInPane,
    domConstruct,
    win
    ) {
    describe('ijit/widgets/_LoginRegisterSignInPane', function () {
        var testWidget;
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };
        beforeEach(function () {
            testWidget = new _LoginRegisterSignInPane({
                parentWidget: {
                    requestPane: {},
                    hideDialog: jasmine.createSpy('hideDialog'),
                    forgotPane: {}
                }
            }, domConstruct.create('div', {}, win.body()));
            testWidget.startup();
        });
        afterEach(function () {
            destroy(testWidget);
        });
        it('create a valid object', function () {
            expect(testWidget).toEqual(jasmine.any(_LoginRegisterSignInPane));
        });
        describe('getData', function () {
            it("return the correct data", function () {
                var email = 'blah';
                var pass = 'blah2';
                testWidget.emailTxt.value = email;
                testWidget.passwordTxt.value = pass;

                expect(testWidget.getData()).toEqual({
                    email: email,
                    password: pass
                }); 
            });
        });
        describe('onSubmitReturn', function () {
            var token = 'blah';
            beforeEach(function () {
                testWidget.onSubmitReturn({result: {token: {token: token}}});
            });
            it("hides the dialog", function () {
                expect(testWidget.parentWidget.hideDialog).toHaveBeenCalled();
            });
            it("gets the returned token", function () {
                expect(testWidget.parentWidget.token).toBe(token);
            });
        });
    });
});
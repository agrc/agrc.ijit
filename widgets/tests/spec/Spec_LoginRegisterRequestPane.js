require([
        'ijit/widgets/authentication/_LoginRegisterRequestPane',
        'dojo/dom-construct',
        'dojo/_base/window',
        'dojo/dom-style'

    ],

    function(
        LoginRegisterRequestPane,
        domConstruct,
        win,
        domStyle
    ) {
        describe('ijit/widgets/authentication/_LoginRegisterRequestPane', function() {
            var testWidget;
            var destroy = function(widget) {
                widget.destroyRecursive();
                widget = null;
            };
            beforeEach(function() {
                testWidget = new LoginRegisterRequestPane({
                    parentWidget: {
                        signInPane: {}
                    }
                }, domConstruct.create('div', {}, win.body()));
                testWidget.startup();
            });
            afterEach(function() {
                destroy(testWidget);
            });
            it('create a valid object', function() {
                expect(testWidget).toEqual(jasmine.any(LoginRegisterRequestPane));
            });
            describe('getData', function() {
                var fName = 'blah1';
                var lName = 'blah5';
                var agency = 'blah2';
                var email = 'blah3';
                var password = 'blah4';
                beforeEach(function() {
                    testWidget.fNameTxt.value = fName;
                    testWidget.lNameTxt.value = lName;
                    testWidget.agencyTxt.value = agency;
                    testWidget.emailTxt.value = email;
                    testWidget.emailConfirmTxt.value = email;
                    testWidget.passwordTxt.value = password;
                    testWidget.passwordConfirmTxt.value = password;
                });
                it('return the appopriate values', function() {
                    expect(testWidget.getData()).toEqual({
                        first: fName,
                        last: lName,
                        agency: agency,
                        email: email,
                        password: password
                    });
                });
                it('validates that the emails and passwords match', function() {
                    testWidget.emailConfirmTxt.value = 'different';

                    expect(function() {
                        testWidget.getData();
                    }).toThrow(testWidget.mismatchedEmailMsg);

                    testWidget.emailConfirmTxt.value = email;
                    testWidget.passwordConfirmTxt.value = 'different';

                    expect(function() {
                        testWidget.getData();
                    }).toThrow(testWidget.mismatchedPasswordMsg);
                });
            });
            describe('onSubmitReturn', function() {
                it('shows the success msg', function() {
                    spyOn(testWidget, 'showSuccessMsg');

                    testWidget.onSubmitReturn();

                    expect(testWidget.showSuccessMsg).toHaveBeenCalled();
                });
                it('hides the request button', function () {
                    testWidget.onSubmitReturn();

                    expect(domStyle.get(testWidget.submitBtn, 'display')).toEqual('none');
                });
            });
        });
    });
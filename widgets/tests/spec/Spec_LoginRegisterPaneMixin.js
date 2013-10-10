require([
    'dojo/dom-construct',
    'dojo/_base/window',
    'dojo/Deferred',
    'dojo/dom-style',

    'ijit/widgets/_LoginRegisterPaneMixin',
    'ijit/widgets/_LoginRegisterSignInPane',
    'ijit/widgets/_LoginRegisterForgotPane',

    'stubmodule/StubModule'
],

function (
    domConstruct,
    win,
    Deferred,
    domStyle,

    _LoginRegisterPaneMixin,
    _LoginRegisterSignInPane,
    _LoginRegisterForgotPane,

    StubModule
    ) {
    describe('ijit/widgets/_LoginRegisterPaneMixin', function () {
        var testWidget;
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };
        var hideDialogSpy = jasmine.createSpy('hideDialog');
        var goToPaneSpy = jasmine.createSpy('goToPane');
        var parentWidget = {
            hideDialog: hideDialogSpy,
            goToPane: goToPaneSpy,
            appName: 'appNameTest'
        };
        beforeEach(function () {
            testWidget = new _LoginRegisterSignInPane({
                parentWidget: parentWidget
            }, domConstruct.create('div', {}, win.body()));
            testWidget.startup();
        });
        afterEach(function () {
            destroy(testWidget);
        });
        it('create a valid object', function () {
            expect(testWidget).toEqual(jasmine.any(_LoginRegisterPaneMixin));
        });
        describe('validate', function () {
            it("returns false if there is a value missing", function () {
                testWidget.emailTxt.value = 'blah';

                expect(testWidget.validate({charCode: 0})).toBe(false);

                testWidget.passwordTxt.value = 'blah';

                expect(testWidget.validate({charCode: 0})).toBe(true);

                testWidget.emailTxt.value = '';

                expect(testWidget.validate({charCode: 0})).toBe(false);
            });
            it('enables and disables the sign in button', function () {
                testWidget.emailTxt.value = 'blah';
                testWidget.validate({charCode: 0});

                expect(testWidget.submitBtn.disabled).toBe(true);

                testWidget.passwordTxt.value = 'blah';
                testWidget.validate({charCode: 0});

                expect(testWidget.submitBtn.disabled).toBe(false);

                testWidget.emailTxt.value = '';
                testWidget.validate({charCode: 0});

                expect(testWidget.submitBtn.disabled).toBe(true);
            });
        });
        describe('onSubmitClick', function () {
            var def;
            var xhr;
            var url;
            var email;
            var password;
            var testWidget2;
            beforeEach(function () {
                def = new Deferred();
                xhr = jasmine.createSpy('xhr').andReturn(def);
                url = 'blah';
                email = 'blah1';
                password = 'blah2';
                var StubbedWidget = StubModule('ijit/widgets/_LoginRegisterSignInPane', {
                    'dojo/request': xhr
                }, ['ijit/widgets/_LoginRegisterPaneMixin']);
                testWidget2 = new StubbedWidget({
                    url: url,
                    parentWidget: parentWidget
                }, domConstruct.create('div', {}, win.body()));
                testWidget2.startup();
            });
            afterEach(function () {
                testWidget2.destroy();
            });
            it("disable the sign in button", function () {
                testWidget2.submitBtn.disabled = false;
                testWidget2.onSubmitClick();

                expect(testWidget2.submitBtn.disabled).toBe(true);
            });
            it("enable the sign in button after the xhr returns", function () {
                testWidget2.onSubmitClick();

                expect(testWidget2.submitBtn.disabled).toBe(true);

                def.resolve();

                expect(testWidget2.submitBtn.disabled).toBe(false);
            });
            it("fire the xhr request", function () {
                testWidget2.emailTxt.value = email;
                testWidget2.passwordTxt.value = password;

                testWidget2.onSubmitClick();

                expect(xhr).toHaveBeenCalled();
                expect(xhr.mostRecentCall.args[0]).toEqual(url);
                var data = xhr.mostRecentCall.args[1].data;
                expect(data).toEqual(JSON.stringify({
                    email: email,
                    password: password,
                    application: parentWidget.appName
                }));

                testWidget2.destroy();
            });
            describe("wires the callbacks", function () {
                beforeEach(function () {
                    testWidget2.onSubmitClick();
                    spyOn(testWidget2, 'onSubmitReturn');
                    spyOn(testWidget2, 'onSubmitError');
                });
                it("success", function () {
                    def.resolve();

                    expect(testWidget2.onSubmitReturn).toHaveBeenCalled();
                });
                it("error", function () {
                    def.reject();

                    expect(testWidget2.onSubmitError).toHaveBeenCalled();
                });
            });
            it("clears the error message", function () {
                spyOn(testWidget, 'hideError');

                testWidget.onSubmitClick();

                expect(testWidget.hideError).toHaveBeenCalled();
            });
            it("handles exception thrown from getData and shows error message", function () {
                var txt = 'blah';
                spyOn(testWidget2, 'showError');
                spyOn(testWidget2, 'getData').andThrow(txt);

                testWidget2.onSubmitClick();

                expect(testWidget2.showError).toHaveBeenCalledWith(txt);
                expect(xhr).not.toHaveBeenCalled();
            });
        });
        describe('showError', function () {
            it("set the div innerHTML and display style", function () {
                var txt = 'blah';
                testWidget.showError(txt);

                expect(testWidget.errorDiv.innerHTML).toEqual(txt);
                expect(domStyle.get(testWidget.errorDiv, 'display')).toBe('block');
            });
        });
        describe('onSubmitError', function () {
            it("pass the error message to the showError function", function () {
                var msg = 'blah';
                spyOn(testWidget, 'showError');

                testWidget.onSubmitError({response: {data: {message: msg}}});

                expect(testWidget.showError).toHaveBeenCalledWith(msg);
            });
        });
        describe('hideError', function () {
            it("hide the error div", function () {
                domStyle.set(testWidget.errorDiv, 'display', 'block');

                testWidget.hideError();

                expect(domStyle.get(testWidget.errorDiv, 'display')).toBe('none');
            });
        });
        describe('focusFirstInput', function () {
            it("focuses the first text box", function () {
                testWidget.focusFirstInput();

                expect(document.activeElement).toBe(testWidget.emailTxt);
            });
        });
        describe('goToRequestPane', function () {
            var evt = {
                preventDefault: jasmine.createSpy('preventDefault')
            };
            it("calls prevent default on the click event", function () {
                testWidget.goToRequestPane(evt);

                expect(evt.preventDefault).toHaveBeenCalled();
            });
            it("calls goToPane", function () {
                testWidget.goToRequestPane(evt);

                expect(goToPaneSpy).toHaveBeenCalledWith(testWidget.parentWidget.requestPane);
            });
        });
        describe('goToForgotPane', function () {
            var evt = {
                preventDefault: jasmine.createSpy('preventDefault')
            };
            it("calls prevent default on the click event", function () {
                testWidget.goToForgotPane(evt);

                expect(evt.preventDefault).toHaveBeenCalled();
            });
            it("calls goToPane", function () {
                testWidget.goToForgotPane(evt);

                expect(goToPaneSpy).toHaveBeenCalledWith(testWidget.parentWidget.forgotPane);
            });
        });
        describe('goToSignInPane', function () {
            var evt = {
                preventDefault: jasmine.createSpy('preventDefault')
            };
            it("calls prevent default on the click event", function () {
                testWidget.goToSignInPane(evt);

                expect(evt.preventDefault).toHaveBeenCalled();
            });
            it("calls goToPane", function () {
                testWidget.goToSignInPane(evt);

                expect(goToPaneSpy).toHaveBeenCalledWith(testWidget.parentWidget.signInPane);
            });
        });
        describe('showSuccessMsg', function () {
            it("hides the form and displays the success alert", function () {
                var testWidget2 = new _LoginRegisterForgotPane({
                    parentWidget: {
                        hideDialog: hideDialogSpy,
                        goToPane: goToPaneSpy
                    }
                }, domConstruct.create('div', {}, win.body()));
                testWidget2.startup();
                
                testWidget2.showSuccessMsg();

                expect(domStyle.get(testWidget2.form, 'display')).toBe('none');
                expect(domStyle.get(testWidget2.successDiv, 'display')).toBe('block');

                destroy(testWidget2);
            });
        });
    });
});
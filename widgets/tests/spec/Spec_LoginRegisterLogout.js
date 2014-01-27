require([
        'ijit/widgets/authentication/_LoginRegisterLogout',
        'dojo/dom-construct',
        'dojo/_base/window',
        'dojo/dom-style'

    ],

    function(
        _LoginRegisterLogout,
        domConstruct,
        win,
        domStyle
    ) {
        describe('ijit/widgets/authentication/_LoginRegisterLogout', function() {
            var testWidget;
            var destroy = function(widget) {
                widget.destroyRecursive();
                widget = null;
            };
            var email = 'blah3';
            beforeEach(function() {
                testWidget = new _LoginRegisterLogout({
                    firstName: 'scott',
                    lastName: 'davis',
                    role: 'some-role',
                    email: email
                }, domConstruct.create('div', {}, win.body()));
                testWidget.startup();
                spyOn(testWidget, 'refreshPage');
            });
            afterEach(function() {
                destroy(testWidget);
            });
            it('create a valid object', function() {
                expect(testWidget).toEqual(jasmine.any(_LoginRegisterLogout));
            });
            describe('postCreate', function () {
                it('display the user admin link if the user is an admin', function () {
                    var testWidget2 = new _LoginRegisterLogout({
                        firstName: 'scott',
                        lastName: 'davis',
                        role: 'admin'
                    }, domConstruct.create('div', {}, win.body()));
                    testWidget2.startup();
                    domStyle.set(testWidget2.adminLink, 'display', 'none');

                    testWidget2.postCreate();
                    
                    expect(domStyle.get(testWidget2.adminLink, 'display')).toEqual('list-item');

                    destroy(testWidget2);
                });
            });
            describe('onSignOutClick', function() {
                var evt = {
                    preventDefault: jasmine.createSpy('preventDefault')
                };
                it("calls prevent default on the click event", function() {
                    testWidget.onSignOutClick(evt);

                    expect(evt.preventDefault).toHaveBeenCalled();
                });
                it("reloads the current window", function() {
                    testWidget.onSignOutClick(evt);

                    expect(testWidget.refreshPage).toHaveBeenCalled();
                });
            });
            describe('onChangePasswordClick', function () {
                var evt = {
                    preventDefault: jasmine.createSpy('preventDefault')
                };
                it("calls prevent default on the click event", function() {
                    testWidget.onChangePasswordClick(evt);

                    expect(evt.preventDefault).toHaveBeenCalled();
                });
                xit('shows the dialog', function () {
                    // couldn't get this spy to work
                    spyOn($(this.modalDiv), 'modal');
                    testWidget.onChangePasswordClick(evt);

                    expect($(this.modalDiv).modal).toHaveBeenCalled();
                });
            });
            describe('getData', function () {
                var cur = 'blah';
                var newpass = 'blah1';
                beforeEach(function () {
                    testWidget.currentPassTxt.value = cur;
                    testWidget.newPassTxt.value = newpass;
                    testWidget.newPassConfirmTxt.value = newpass;
                });
                it('returns the appropriate values', function () {
                    expect(testWidget.getData()).toEqual({
                        email: email,
                        currentPassword: cur,
                        newpassword: newpass,
                        newpasswordrepeated: newpass
                    });
                });
                it('verifies that confirm password matches new password', function () {
                    testWidget.newPassConfirmTxt.value = 'different';

                    expect(function () {
                        testWidget.getData();
                    }).toThrow(testWidget.mismatchedPasswordErrMsg);
                });
            });
            describe('onSubmitReturn', function () {
                it('hides the form and shows the success message', function () {
                    testWidget.onSubmitReturn();

                    expect(domStyle.get(testWidget.form, 'display')).toBe('none');
                    expect(domStyle.get(testWidget.successDiv, 'display')).toBe('block');
                    expect(domStyle.get(testWidget.submitBtn, 'display')).toBe('none');
                });
            });
        });
    });
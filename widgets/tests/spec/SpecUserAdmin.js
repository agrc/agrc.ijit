require([
        'ijit/widgets/authentication/UserAdmin',
        'dojo/dom-construct',
        'dojo/_base/window',
        'stubmodule/StubModule',
        'dojo/Deferred',
        'dojo/dom-style'

    ],

    function(
        UserAdmin,
        domConstruct,
        win,
        StubModule,
        Deferred,
        domStyle
    ) {
        describe('ijit/widgets/authentication/UserAdmin', function() {
            var testWidget;
            var destroy = function(widget) {
                widget.destroyRecursive();
                widget = null;
            };
            beforeEach(function() {
                testWidget = new UserAdmin({}, domConstruct.create('div', {}, win.body()));
                testWidget.startup();
                testWidget.login.user = {
                    adminToken: 'blah'
                };
            });
            afterEach(function() {
                destroy(testWidget);
            });
            it('create a valid object', function() {
                expect(testWidget).toEqual(jasmine.any(UserAdmin));
            });
            describe('getUsers', function() {
                // https://github.com/agrc/StubModule/issues/3
                // xit('gets all users from web service', function() {
                //     var def = new Deferred();
                //     var xhrSpy = jasmine.createSpy('xhr').andReturn(def);
                //     var StubbedModule = StubModule('ijit/widgets/authentication/UserAdmin', {
                //         'dojo/request': xhrSpy
                //     });
                //     var testWidget2 = new StubbedModule({}, domConstruct.create('div', {}, win.body()));
                //     spyOn(testWidget2, 'buildUsers');

                //     testWidget2.getUsers();

                //     expect(xhrSpy).toHaveBeenCalled();

                //     def.resolve();

                //     expect(testWidget2.buildUsers).toHaveBeenCalled();
                // });
            });
            describe('onError', function() {
                it('show\'s the error message', function() {
                    var msg = 'blah';
                    testWidget.onError({
                        message: msg
                    });

                    expect(testWidget.errMsgDiv.innerHTML).toBe(msg);
                    expect(domStyle.get(testWidget.errMsgDiv, 'display')).toBe('block');
                });
            });
            describe('showUsers', function() {
                it('builds user object for each user', function() {
                    var users = [{
                        email: 'email1',
                        name: 'name1',
                        agency: 'name1'
                    }, {
                        email: 'email2',
                        name: 'name2',
                        agency: 'name2'
                    }];
                    testWidget.showUsers({
                        result: users
                    });

                    expect(testWidget.userContainer.children.length).toBe(2);
                });
                it('show\'s a message when there are no users', function() {
                    domStyle.set(testWidget.noUsersMsg, 'display', 'none'); // in UserAdmin.css
                    testWidget.showUsers({
                        result: []
                    });

                    expect(domStyle.get(testWidget.noUsersMsg, 'display')).toBe('block');
                });
            });
        });
    });
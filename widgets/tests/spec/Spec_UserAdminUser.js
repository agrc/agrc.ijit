require([
        'ijit/widgets/authentication/_UserAdminUser',
        'dojo/dom-construct',
        'dojo/dom-style',
        'dojo/_base/window',
        'dojo/query'

    ],

    function(
        UserAdminUser,
        domConstruct,
        domStyle,
        win,
        query
    ) {
        describe('ijit/widgets/authentication/_UserAdminUser', function() {
            var testWidget;
            var destroy = function(widget) {
                widget.destroyRecursive();
                widget = null;
            };
            var email = 'test@test.com';
            var roles = ['role1', 'role2', 'role3'];
            beforeEach(function() {
                testWidget = new UserAdminUser({
                    name: 'blah',
                    agency: 'blah2',
                    email: email,
                    roles: roles
                }, domConstruct.create('div', {}, win.body()));
                testWidget.startup();
            });
            afterEach(function() {
                destroy(testWidget);
            });
            it('create a valid object', function() {
                expect(testWidget).toEqual(jasmine.any(UserAdminUser));
            });
            describe('postCreate', function() {
                it('creates a button for each role', function() {
                    expect(query('.btn-group .btn', testWidget.domNode).length).toBe(3);
                });
                it('wires the buttons to the assignRole method', function() {
                    spyOn(testWidget, 'assignRole');

                    testWidget.roleBtnGroup.children[0].click();

                    expect(testWidget.assignRole).toHaveBeenCalledWith(roles[0]);
                });
            });
            describe('onSuccess', function() {
                it('turns background color to green and then fades out', function() {
                    testWidget.onSuccess();

                    expect(domStyle.get(testWidget.wellDiv, 'backgroundColor')).toBe(testWidget.successColor);
                });
            });
        });
    });
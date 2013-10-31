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
            beforeEach(function() {
                testWidget = new _LoginRegisterLogout({
                    name: 'scott',
                    role: 'some-role'
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
                        name: 'scott',
                        role: 'admin'
                    }, domConstruct.create('div', {}, win.body()));
                    testWidget2.startup();
                    
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
        });
    });
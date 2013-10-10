require([
        'dojo/_base/window',

        'dojo/dom-construct',
        'dojo/dom-style',
        'dojo/dom-class',

        'dojo/Deferred',

        'ijit/widgets/LoginRegister',
        // have to preload these for tests since we are creating the widget programmatically
        'ijit/widgets/_LoginRegisterSignInPane',
        'ijit/widgets/_LoginRegisterRequestPane'
    ],

    function(
        win,

        domConstruct,
        domStyle,
        domClass,

        Deferred,

        LoginRegister
    ) {
        describe('ijit/widgets/LoginRegister', function() {
            var testWidget;
            // mock query stuff because I'm too cool to include jquery in my tests :)
            window.$ = function() {
                return {
                    modal: function() {
                        return this;
                    },
                    on: function() {}
                };
            };
            var destroy = function(widget) {
                widget.destroyRecursive();
                widget = null;
            };
            beforeEach(function() {
                testWidget = new LoginRegister({}, domConstruct.create('div', {}, win.body()));
                testWidget.startup();
            });
            afterEach(function() {
                destroy(testWidget);
            });
            it('create a valid object', function() {
                expect(testWidget).toEqual(jasmine.any(LoginRegister));
            });
            describe('startup options:', function() {
                it('will display after startup', function() {
                    testWidget = new LoginRegister({
                        showOnLoad: true
                    }, domConstruct.create('div', {}, win.body()));
                    testWidget.startup();

                    expect(domStyle.get(testWidget.modalDiv, 'display')).toBe('block');

                    //race condition
                    //expect(domClass.contains(testWidget.modalDiv, 'in')).toBeTruthy();
                });
                it('can be hiddin on startup', function() {
                    destroy(testWidget);

                    testWidget = new LoginRegister({
                        showOnLoad: false
                    }, domConstruct.create('div', {}, win.body()));
                    testWidget.startup();

                    expect(domClass.contains(testWidget.modalDiv, 'in')).toBeFalsy();
                });
                it('can be shown after creation', function() {
                    destroy(testWidget);

                    testWidget = new LoginRegister({
                        showOnLoad: false
                    }, domConstruct.create('div', {}, win.body()));
                    testWidget.startup();

                    expect(domClass.contains(testWidget.modalDiv, 'in')).toBeFalsy();

                    testWidget.show();

                    expect(domStyle.get(testWidget.modalDiv, 'display')).toBe('block');
                });
            });
            describe('goToPane', function() {
                it('calls selectChild with the appropriate pane', function() {
                    spyOn(testWidget.stackContainer, 'selectChild');

                    testWidget.goToPane(testWidget.requestPane);

                    expect(testWidget.stackContainer.selectChild)
                        .toHaveBeenCalledWith(testWidget.requestPane);
                });
                it('calls focusFirstInput on the pane', function() {
                    spyOn(testWidget.signInPane, 'focusFirstInput');

                    testWidget.goToPane(testWidget.signInPane);

                    expect(testWidget.signInPane.focusFirstInput).toHaveBeenCalled();
                });
            });
        });
    });
require([
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-class',

    'dojo/Deferred',

    'stubmodule',

    'ijit/widgets/authentication/LoginRegister'


    // have to preload these for tests since we are creating the widget programmatically
    // 'ijit/widgets/authentication/_LoginRegisterSignInPane',
    // 'ijit/widgets/authentication/_LoginRegisterRequestPane',
    // 'ijit/widgets/authentication/_LoginRegisterLogout'
], function(
    domConstruct,
    domStyle,
    domClass,

    Deferred,

    stubmodule,

    LoginRegister
) {
    describe('ijit/widgets/authentication/LoginRegister', function() {
        var testWidget;
        var baseUrl = 'http://base.url';
        
        var destroy = function(widget) {
            widget.destroyRecursive();
            widget = null;
        };
        beforeEach(function() {
            testWidget = new LoginRegister({
                securedServicesBaseUrl: baseUrl
            }, domConstruct.create('div', {}, document.body));
            testWidget.startup();
        });
        afterEach(function() {
            destroy(testWidget);
        });
        it('create a valid object', function() {
            expect(testWidget).toEqual(jasmine.any(LoginRegister));
        });
        describe('postCreate', function() {
            it('wires up onSignInSuccess', function() {
                spyOn(testWidget, 'onSignInSuccess');

                testWidget.signInPane.emit('sign-in-success');

                expect(testWidget.onSignInSuccess).toHaveBeenCalled();
            });
            it('calls rememberMe', function() {
                spyOn(testWidget, 'rememberMe');

                testWidget.postCreate();

                expect(testWidget.rememberMe).toHaveBeenCalled();
            });
        });
        describe('rememberMe', function() {
            it('calls rememberme service', function(done) {
                var xhrSpy = jasmine.createSpy('xhr');
                stubmodule('ijit/widgets/authentication/LoginRegister', {
                    'dojo/request': xhrSpy
                }).then(function (StubbedModule) {
                    var testWidget2 = new StubbedModule({}, domConstruct.create('div', {}, document.body));
                    testWidget2.startup();

                    testWidget2.rememberMe();

                    expect(xhrSpy.calls.count()).toBe(2);
                    expect(xhrSpy.calls.mostRecent().args[0])
                        .toEqual(testWidget2.urls.base + testWidget2.urls.rememberme);

                    destroy(testWidget2);
                    done();
                });
            });
        });
        describe('startup options:', function() {
            beforeEach(function() {
                destroy(testWidget);
            });
            it('will display after startup', function() {
                testWidget = new LoginRegister({
                    showOnLoad: true
                }, domConstruct.create('div', {}, document.body));
                testWidget.startup();

                expect(domStyle.get(testWidget.modalDiv, 'display')).toBe('block');

                //race condition
                // expect(domClass.contains(testWidget.modalDiv, 'in')).toBeTruthy();
            });
            it('can be hiddin on startup', function() {
                destroy(testWidget);

                testWidget = new LoginRegister({
                    showOnLoad: false
                }, domConstruct.create('div', {}, document.body));
                testWidget.startup();

                expect(domClass.contains(testWidget.modalDiv, 'in')).toBeFalsy();
            });
            it('can be shown after creation', function() {

                testWidget = new LoginRegister({
                    showOnLoad: false
                }, domConstruct.create('div', {}, document.body));
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
        describe('onSignInSuccess', function() {
            it('should create the logout widget if not already created', function(done) {
                var logoutSpy = jasmine.createSpy('logoutSpy');
                stubmodule('ijit/widgets/authentication/LoginRegister', {
                    'ijit/widgets/authentication/_LoginRegisterLogout': logoutSpy
                }).then(function (StubbedModule) {
                    var testWidget2 = new StubbedModule({}, domConstruct.create('div', {}, document.body));
                    spyOn(testWidget2, 'registerToken');

                    testWidget2.onSignInSuccess({user: {}, token: ''});

                    expect(logoutSpy.calls.count()).toBe(1);

                    destroy(testWidget2);
                    done();
                });
            });
        });
        describe('onRequestPreCallback', function() {
            it('adds the token to the content only for services that match the baseUrl', function() {
                var ioArgs = {
                    content: {},
                    url: baseUrl.toLowerCase() + '/blah/blah'
                };
                var token = 'blah';
                testWidget.token = token;

                expect(testWidget.onRequestPreCallback(ioArgs).content.token)
                    .toBe(token);

                ioArgs.url = 'blah';
                delete ioArgs.content.token;

                expect(testWidget.onRequestPreCallback(ioArgs).content.token)
                    .toBeUndefined();
            });
            it('adds the token to all requests if no baseUrl is specified', function() {
                var ioArgs = {
                    content: {},
                    url: 'blah'
                };

                var testWidget2 = new LoginRegister({}, domConstruct.create('div', {}, document.body));
                testWidget2.startup();

                var token = 'blah';
                testWidget2.token = token;

                expect(testWidget2.onRequestPreCallback(ioArgs).content.token)
                    .toBe(token);

                destroy(testWidget2);
            });
        });
        describe('SecuredServicesBaseUrl', function() {
            it('makes full url from relative', function() {
                destroy(testWidget);
                testWidget = new LoginRegister({
                        securedServicesBaseUrl: 'blah'
                    },
                    domConstruct.create('div', {}, document.body));
                testWidget.startup();

                expect(testWidget.securedServicesBaseUrl).toEqual('http://localhost:8000/blah');
            });
            it('gives same url if qualified', function() {
                destroy(testWidget);
                var fullyQualified = 'http://mapserv.utah.gov/arcgis/rest';
                testWidget = new LoginRegister({
                        securedServicesBaseUrl: fullyQualified
                    },
                    domConstruct.create('div', {}, document.body));
                testWidget.startup();


                expect(testWidget.securedServicesBaseUrl).toEqual(fullyQualified);
            });
        });
    });
});
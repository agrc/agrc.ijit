require({
    map: {
        'ladda': {
            'spin': 'ladda/dist/spin'
        }
    }
});
define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/aspect',
    'dojo/Deferred',
    'dojo/dom-construct',
    'dojo/request',
    'dojo/text!./templates/LoginRegister.html',
    'dojo/topic',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/window',

    'esri/config',
    'esri/IdentityManagerBase',
    'esri/kernel',
    'esri/request',

    'ijit/widgets/authentication/_LoginRegisterForgotPane',
    'ijit/widgets/authentication/_LoginRegisterLogout',
    'ijit/widgets/authentication/_LoginRegisterRequestPane',
    'ijit/widgets/authentication/_LoginRegisterSignInPane',

    'bootstrap',
    'dijit/layout/ContentPane',
    'dijit/layout/StackContainer',
    'jquery'
], function(
    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    aspect,
    Deferred,
    domConstruct,
    xhr,
    template,
    topic,
    declare,
    lang,
    win,

    esriConfig,
    IdentityManagerBase,
    kernel,
    esriRequest,

    LoginRegisterForgotPane,
    LoginRegisterLogout,
    LoginRegisterRequestPane,
    LoginRegisterSignInPane
) {
    // summary:
    //      Works with agrc/ArcGisServerPermissionsProxy to allow users to register or login.
    // requires:
    //      jquery and bootstrap.js
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, IdentityManagerBase], {
        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'login-register',

        // modal: Bootstrap Modal Dialog
        modal: null,

        // signInPane: _LoginRegisterSignInPane
        signInPane: null,

        // requestPane: _LoginRegisterRequestPane
        requestPane: null,

        // forgotPane: _LoginRegisterRequestPane
        forgotPane: null,

        // logout: _LoginRegisterLogout
        logout: null,

        urls: {
            base: '/permissionproxy/api',
            signIn: '/authenticate/user',
            request: '/user/register',
            reset: '/user/resetpassword',
            change: '/user/changepassword',
            rememberme: '/authenticate/rememberme',
            forgetme: '/authenticate/forgetme'
        },

        // topics: {<name>: String}
        //      topic strings associated with this widget
        topics: {
            signInSuccess: 'LoginRegister/sign-in-success'
        },

        // token: String
        //      The ArcGIS Server token
        token: null,

        // tokenExpireDate: Date
        //      The date and time when the token expires
        tokenExpireDate: null,

        // user: Object
        //      The user object returns by the authentication service
        //      For example:
        //      {
        //          "email": "stdavis@utah.gov",
        //          "role": "report-generator",
        //          "name": "Scott Davis",
        //          "agency": "AGRC"
        //      },
        user: null,


        // parameters passed in via the constructor

        // appName: String
        //      The name of the app in the permissionproxy database
        //      e.g. 'pel' for 'app_pel' in the raven database
        appName: null,

        // logoutDiv: Dom Element
        //      The dom element in which you want the logout control placed
        logoutDiv: null,

        // showOnLoad: boolean
        //      The flag to show the login thing on creation or wait to trigger it.
        showOnLoad: true,

        // securedServicesBaseUrl: String
        //      The base url for which you would like all matching requests to have
        //      the token sent with. If none is specified, all requests will have
        //      the token appended.
        securedServicesBaseUrl: null,

        // isAdminPage: Boolean
        //      disabled esri token stuff because we are not interacting with
        //      arcgis server
        isAdminPage: false,

        constructor: function() {
            // summary:
            //      constructor
            console.log('ijit/widgets/authentication/LoginRegister:constructor', arguments);

            kernel.id = this;
        },
        postCreate: function() {
            // summary:
            //      dom is ready
            console.log('ijit/widgets/authentication/LoginRegister:postCreate', arguments);

            if (this.securedServicesBaseUrl) {
                var parser = document.createElement('a');
                parser.href = this.securedServicesBaseUrl;
                this.securedServicesBaseUrl = parser.href;
            }

            // create panes
            this.signInPane = new LoginRegisterSignInPane({
                url: this.urls.base + this.urls.signIn,
                parentWidget: this
            }, this.signInPaneDiv);
            this.signInPane.on('sign-in-success', lang.hitch(this, 'onSignInSuccess'));
            this.requestPane = new LoginRegisterRequestPane({
                url: this.urls.base + this.urls.request,
                parentWidget: this
            }, this.requestPaneDiv);
            this.forgotPane = new LoginRegisterForgotPane({
                url: this.urls.base + this.urls.reset,
                parentWidget: this
            }, this.forgotPaneDiv);
            this.stackContainer.startup();

            this.modal = $(this.modalDiv).modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });

            domConstruct.place(this.domNode, win.body());

            this.rememberMe();
        },
        rememberMe: function() {
            // summary:
            //      Hits the rememberme service to check if we have a good cookie
            console.log('ijit/widgets/authenticate/LoginRegister:rememberMe', arguments);

            var unsuccessful = lang.hitch(this, function() {
                // focus email text box when form is shown
                if (this.showOnLoad) {
                    this.show();
                    this.signInPane.emailTxt.focus();
                }

                domConstruct.create('a', {
                    innerHTML: 'Sign in',
                    href: '#',
                    onclick: lang.hitch(this, function(evt) {
                        evt.preventDefault();
                        this.show();
                        this.goToPane(this.signInPane);
                    }),
                    'class': this.baseClass
                }, this.logoutDiv);
            });

            var def;
            try {
                def = xhr(this.urls.base + this.urls.rememberme, {
                    handleAs: 'json',
                    method: 'GET',
                    query: {
                        appName: this.appName
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    lang.hitch(this.signInPane, this.signInPane.onSubmitReturn),
                    unsuccessful
                );
            } catch (e) {
                unsuccessful();
            }

            return def;
        },
        goToPane: function(pane) {
            // summary:
            //      fires when the user clicks the "Request Access" link
            // pane: _LoginRegisterPane
            console.log('ijit/widgets/authentication/LoginRegister:goToPane', arguments);

            this.stackContainer.selectChild(pane);
            pane.focusFirstInput();
        },
        hideDialog: function() {
            // summary:
            //      hides the modal dialog
            console.log('ijit/widgets/authentication/LoginRegister:hideDialog', arguments);

            $(this.modalDiv).modal('hide');
        },
        show: function() {
            // summary:
            //      shows the login modal
            //
            console.log('ijit/widgets/authentication/LoginRegister:show', arguments);

            $(this.modalDiv).modal('show');
        },
        signIn: function() {
            // summary:
            //      overridden from IdentityManagerBase
            console.log('ijit/widgets/authentication/LoginRegister:signIn', arguments);

            this.def = new Deferred();
            this.show();
            this.goToPane(this.signInPane);

            return this.def;
        },
        onSignInSuccess: function(loginResult) {
            // summary:
            //      called when the user has successfully signed in
            // loginResult: Object
            //      result object as returned from the server
            console.log('ijit/widgets/authentication/LoginRegister:onSignInSuccess', arguments);

            this.logout = new LoginRegisterLogout({
                firstName: loginResult.user.first,
                lastName: loginResult.user.last,
                role: loginResult.user.role,
                email: loginResult.user.email,
                url: this.urls.base + this.urls.change,
                parentWidget: this
            }, this.logoutDiv);

            // add token to all future requests
            esriRequest.setRequestPreCallback(lang.hitch(this, 'onRequestPreCallback'));

            var c = new IdentityManagerBase.Credential({
                userId: loginResult.user.userId,
                server: this.securedServicesBaseUrl || document.location.origin,
                ssl: false,
                isAdmin: false,
                token: loginResult.token.token,
                expires: loginResult.token.expires
            });

            topic.publish(this.topics.signInSuccess, loginResult);

            if (!this.isAdminPage) {
                this.registerToken(c);
            }

            // remove strange server that's added within the call to registerToken above
            // this appears to only apply to apps on domains that are different from the base domain
            // in securedServicesBaseUrl
            var crazyUrlIndex = esriConfig.defaults.io.corsEnabledServers.indexOf('null://undefined');
            if (crazyUrlIndex > -1) {
                esriConfig.defaults.io.corsEnabledServers.splice(crazyUrlIndex, 1);
            }

            if (this.def) {
                this.def.resolve(c);
            }
        },
        onRequestPreCallback: function(ioArgs) {
            // summary:
            //      fires just before each request to the server
            // ioArgs: {}
            //      the data that will be sent with the request
            console.log('ijit/widgets/authentication/LoginRegister:onRequestPreCallback', arguments);

            if (!this.securedServicesBaseUrl ||
                ioArgs.url.toUpperCase().indexOf(this.securedServicesBaseUrl.toUpperCase()) !== -1) {
                ioArgs.content.token = this.token;
            }

            return ioArgs;
        },
        generateToken: function() {
            // summary:
            //      overriden from IdentityManagerBase
            //      attempt at auto generating a new token when your token is invalid
            //      I believe that IdentityManagerBase automatically calls this when you
            //      token is about to expire
            console.log('ijit/widgets/authentication/LoginRegister:generateToken', arguments);

            return this.rememberMe();
        }
    });
});

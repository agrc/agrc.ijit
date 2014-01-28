define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/window',

        'dojo/request',
        'dojo/dom-style',
        'dojo/dom-construct',
        'dojo/aspect',
        'dojo/topic',

        'dojo/text!./templates/LoginRegister.html',

        'dijit/_TemplatedMixin',
        'dijit/_WidgetBase',
        'dijit/_WidgetsInTemplateMixin',

        'esri/request',

        'ijit/widgets/authentication/_LoginRegisterSignInPane',
        'ijit/widgets/authentication/_LoginRegisterRequestPane',
        'ijit/widgets/authentication/_LoginRegisterForgotPane',
        'ijit/widgets/authentication/_LoginRegisterLogout',

        // no params
        'dijit/layout/StackContainer',
        'dijit/layout/ContentPane',
        'jquery'
    ],

    function(
        declare,
        lang,
        win,

        xhr,
        domStyle,
        domConstruct,
        aspect,
        topic,
        
        template,

        _TemplatedMixin,
        _WidgetBase,
        _WidgetsInTemplateMixin,

        esriRequest,

        _LoginRegisterSignInPane,
        _LoginRegisterRequestPane,
        _LoginRegisterForgotPane,
        _LoginRegisterLogout
    ) {
        // summary:
        //      Works with agrc/ArcGisServerPermissionsProxy to allow users to register or login.
        // requires:
        //      jquery and bootstrap.js
        return declare('widgets/authentication/LoginRegister', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
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
                change: '/user/changepassword'
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

            postCreate: function() {
                // summary:
                //      dom is ready
                console.log(this.declaredClass + '::postCreate', arguments);

                var that = this;

                // create panes
                this.signInPane = new _LoginRegisterSignInPane({
                    url: this.urls.base + this.urls.signIn,
                    parentWidget: this
                }, this.signInPaneDiv);
                this.signInPane.on('sign-in-success', lang.hitch(this, 'onSignInSuccess'));
                this.requestPane = new _LoginRegisterRequestPane({
                    url: this.urls.base + this.urls.request,
                    parentWidget: this
                }, this.requestPaneDiv);
                this.forgotPane = new _LoginRegisterForgotPane({
                    url: this.urls.base + this.urls.reset,
                    parentWidget: this
                }, this.forgotPaneDiv);
                this.stackContainer.startup();

                domConstruct.place(this.domNode, win.body());

                // this is to make sure that bootstrap is loaded after jQuery
                require(['bootstrap'], function() {
                    that.modal = $(that.modalDiv).modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: that.showOnLoad
                    });

                    // focus email text box when form is shown
                    if (that.showOnLoad) {
                        that.signInPane.emailTxt.focus();
                    }
                });
            },
            goToPane: function(pane) {
                // summary:
                //      fires when the user clicks the "Request Access" link
                // pane: _LoginRegisterPane
                console.log(this.declaredClass + '::goToPane', arguments);

                this.stackContainer.selectChild(pane);
                pane.focusFirstInput();
            },
            hideDialog: function() {
                // summary:
                //      hides the modal dialog
                console.log(this.declaredClass + '::hideDialog', arguments);

                $(this.modalDiv).modal('hide');
            },
            show: function() {
                // summary:
                //      shows the login modal
                // 
                console.log(this.declaredClass + '::show', arguments);

                $(this.modalDiv).modal('show');
            },
            onSignInSuccess: function(loginResult) {
                // summary:
                //      called when the user has successfully signed in
                // loginResult: Object
                //      result object as returned from the server
                console.log(this.declaredClass + "::onSignInSuccess", arguments);

                this.logout = new _LoginRegisterLogout({
                    firstName: loginResult.user.first,
                    lastName: loginResult.user.last,
                    role: loginResult.user.role,
                    email: loginResult.user.email,
                    url: this.urls.base + this.urls.change,
                    parentWidget: this
                }, this.logoutDiv);

                topic.publish('LoginRegister/sign-in-success', loginResult);

                // add token to all future requests
                esriRequest.setRequestPreCallback(lang.hitch(this, 'onRequestPreCallback'));
            },
            onRequestPreCallback: function(ioArgs) {
                // summary:
                //      fires just before each request to the server
                // ioArgs: {}
                //      the data that will be sent with the request
                console.log(this.declaredClass + "::onRequestPreCallback", arguments);

                if (!this.securedServicesBaseUrl || 
                    ioArgs.url.toUpperCase().indexOf(this.securedServicesBaseUrl.toUpperCase()) !== -1) {
                    ioArgs.content.token = this.token;
                }
                return ioArgs;
            }
        });
    });
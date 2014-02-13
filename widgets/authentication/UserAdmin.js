define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',

        'dojo/text!./templates/UserAdmin.html',

        'dojo/request',
        'dojo/dom-style',
        'dojo/dom-construct',

        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',

        'jquery',
        './LoginRegister',
        './_UserAdminUser'
    ],

    function(
        declare,
        lang,
        array,

        template,

        request,
        domStyle,
        domConstruct,

        _WidgetBase,
        _TemplatedMixin,
        _WidgetsInTemplateMixin,

        jquery,
        LoginRegister,
        _UserAdminUser
    ) {
        // summary:
        //      Provides controls to allow admins to do things like acceept users, delete users and reset passwords.
        return declare('ijit/widgets/authentication/UserAdmin', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            widgetsInTemplate: true,
            templateString: template,
            baseClass: 'user-admin',

            urls: {
                base: '/permissionproxy/api',
                getallwaiting: '/admin/getallwaiting',
                getroles: '/admin/getroles',
                del: '/admin/reject',
                reset: '/user/resetpassword'
            },

            // roles: String[]
            //      as returned by GetRoles
            roles: null,

            // login: LoginRegister
            login: null,


            // params passed in via the constructor

            // appName: String
            //      The name of the associated application in the Raven DB
            appName: null,

            postCreate: function() {
                // summary:
                //      dom is ready
                console.log(this.declaredClass + "::postCreate", arguments);

                var that = this;

                this.login = new LoginRegister({
                    appName: this.appName,
                    logoutDiv: this.logoutDiv,
                    isAdminPage: true
                });

                this.login.on('sign-in-success', function() {
                    that.getRoles();
                });
            },
            getRoles: function() {
                // summary:
                //      gets roles for app
                console.log(this.declaredClass + "::getRoles", arguments);

                var def = request(this.urls.base + this.urls.getroles, {
                    query: {
                        application: this.appName
                    },
                    handleAs: 'json'
                });
                var that = this;
                def.then(function(response) {
                    that.roles = response.result;
                    that.getUsers();
                }, lang.hitch(this, 'onError'));
            },
            getUsers: function() {
                // summary:
                //      calls getallwaiting
                console.log(this.declaredClass + "::getUsers", arguments);

                request(this.urls.base + this.urls.getallwaiting, {
                    query: {
                        application: this.appName
                    },
                    handleAs: 'json'
                }).then(lang.hitch(this, 'showUsers'), lang.hitch(this, 'onError'));
            },
            onError: function(response) {
                // summary:
                //      error callback for xhr
                // response: {}
                //      response object from server
                console.log(this.declaredClass + "::onError", arguments);

                this.errMsgDiv.innerHTML = response.message;
                domStyle.set(this.errMsgDiv, 'display', 'block');
            },
            showUsers: function(response) {
                // summary:
                //      callback from getallwaiting
                //      builds user widgets
                // response: {}
                //      response object from server
                console.log(this.declaredClass + "::showUsers", arguments);

                var users = response.result;

                if (users.length === 0) {
                    domStyle.set(this.noUsersMsg, 'display', 'block');
                } else {
                    array.forEach(users, function(u) {
                        new _UserAdminUser(lang.mixin(u, {
                            roles: this.roles,
                            adminToken: this.login.user.adminToken,
                            appName: this.appName
                        }), domConstruct.create('div', {}, this.userContainer));
                    }, this);
                }
            },
            destroyRecursive: function() {
                // summary:
                //      mostly for tear down during tests
                console.log(this.declaredClass + "::destroyRecursive", arguments);

                this.login.destroyRecursive();
                this.inherited(arguments);
            },
            deleteUser: function() {
                // summary:
                //      fires when the user clicks the delete button
                console.log(this.declaredClass + "::deleteUser", arguments);

                this.sendRequest(
                    this.deleteSuccessMsgDiv,
                    this.urls.del,
                    this.delEmailTxt,
                    'DELETE',
                    this.deleteUserSpan,
                    this.deleteErrMsgDiv);
            },
            resetPassword: function() {
                // summary:
                //      fires when the user clicks on the reset button
                console.log(this.declaredClass + "::resetPassword", arguments);

                this.sendRequest(
                    this.resetSuccessMsgDiv,
                    this.urls.reset,
                    this.resetEmailTxt,
                    'PUT',
                    this.resetUserSpan,
                    this.resetErrMsgDiv);
            },
            sendRequest: function(successMsg, service, textBox, verb, userSpan, errDiv) {
                // summary:
                //      send reset or delete request
                console.log(this.declaredClass + "::sendRequest", arguments);

                domStyle.set(successMsg, 'display', 'none');
                domStyle.set(errDiv, 'display', 'none');

                request(this.urls.base + service, {
                    data: JSON.stringify({
                        email: textBox.value,
                        application: this.appName,
                        adminToken: this.login.user.adminToken
                    }),
                    handleAs: 'json',
                    method: verb,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function() {
                    userSpan.innerHTML = textBox.value;
                    textBox.value = '';
                    domStyle.set(successMsg, 'display', 'block');
                }, function(response) {
                    errDiv.innerHTML = response.message;
                    domStyle.set(errDiv, 'display', 'block');
                });
            }
        });
    });
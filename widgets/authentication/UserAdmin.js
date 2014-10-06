define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',

        'dojo/text!./templates/UserAdmin.html',

        'dojo/request',
        'dojo/dom-style',
        'dojo/dom-construct',
        'dojo/store/Memory',
        'dojo/topic',

        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',

        'dgrid/OnDemandGrid',

        'jquery',
        'ijit/widgets/authentication/LoginRegister',
        'ijit/widgets/authentication/_UserAdminPendingUser',
        'ijit/widgets/authentication/_UserAdminUser'
    ],

    function(
        declare,
        lang,
        array,

        template,

        request,
        domStyle,
        domConstruct,
        Memory,
        topic,

        _WidgetBase,
        _TemplatedMixin,
        _WidgetsInTemplateMixin,

        Grid,

        jquery,
        LoginRegister,
        UserAdminPendingUser,
        UserAdminUser
    ) {
        // summary:
        //      Provides controls to allow admins to do things like acceept users, delete users and reset passwords.
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            widgetsInTemplate: true,
            templateString: template,
            baseClass: 'user-admin',

            urls: {
                base: '/permissionproxy/api',
                getallwaiting: '/admin/getallwaiting',
                getallapproved: '/admin/getallapproved',
                getroles: '/admin/getroles'
            },

            fieldNames: {
                id: 'userId',
                email: 'email',
                role: 'role',
                lastLogin: 'lastLogin',
                first: 'first',
                last: 'last',
                agency: 'agency'
            },

            // roles: String[]
            //      as returned by GetRoles
            roles: null,

            // login: LoginRegister
            login: null,

            // grid: Grid
            //      the approved users grid
            grid: null,


            // params passed in via the constructor

            // appName: String
            //      The name of the associated application in the Raven DB
            appName: null,

            postCreate: function() {
                // summary:
                //      dom is ready
                console.log('ijit/widgets/authentication/UserAdmin:postCreate', arguments);

                var that = this;

                this.login = new LoginRegister({
                    appName: this.appName,
                    logoutDiv: this.logoutDiv,
                    isAdminPage: true
                });

                this.login.on('sign-in-success', function() {
                    that.getRoles();
                });

                this.own(
                    topic.subscribe(UserAdminPendingUser.prototype.successTopic, function () {
                        that.getUsers(true);
                    })
                );
            },
            getRoles: function() {
                // summary:
                //      gets roles for app
                console.log('ijit/widgets/authentication/UserAdmin:getRoles', arguments);

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
            getUsers: function(approvedOnly) {
                // summary:
                //      calls getallwaiting & getallapproved
                console.log('ijit/widgets/authentication/UserAdmin:getUsers', arguments);

                var that = this;
                var makeRequest = function (url, callback) {
                    request(that.urls.base + url, {
                        query: {
                            application: that.appName,
                            adminToken: that.login.user.adminToken
                        },
                        handleAs: 'json'
                    }).then(lang.hitch(that, callback), lang.hitch(that, 'onError'));
                };

                if (!approvedOnly) {
                    makeRequest(this.urls.getallwaiting, 'showWaitingUsers');
                }
                makeRequest(this.urls.getallapproved, 'showApprovedUsers');
            },
            showApprovedUsers: function (response) {
                // summary:
                //      builds the approved users grid
                // response: {}
                //      response object from getallapproved service
                console.log('ijit/widgets/authentication/UserAdmin:showApprovedUsers', arguments);
                
                var that = this;
                var getStore = function () {
                    return new Memory({
                        data: response.result,
                        idProperty: that.fieldNames.email
                    });
                };

                if (!this.grid) {
                    this.grid = new Grid({
                        store: getStore(),
                        columns: [
                            {
                                label: 'Edit',
                                field: this.fieldNames.id,
                                renderCell: function (object) {
                                    return domConstruct.create('button', {
                                        value: object[that.fieldNames.email],
                                        innerHTML: '...',
                                        'class': 'btn btn-default btn-xs',
                                        onclick: function () {
                                            that.editUser(object);
                                        }
                                    });
                                }
                            },
                            {label: 'Email', field: this.fieldNames.email},
                            {label: 'First Name', field: this.fieldNames.first},
                            {label: 'Last Name', field: this.fieldNames.last},
                            {label: 'Agency', field: this.fieldNames.agency},
                            {label: 'Role', field: this.fieldNames.role},
                            {
                                label: 'Last Login',
                                field: this.fieldNames.lastLogin,
                                formatter: function (value) {
                                    if (value > 0) {
                                        return new Date(value).toLocaleString();
                                    } else {
                                        return '';
                                    }
                                }
                            }
                        ]
                    }, this.userGrid);
                    this.grid.set('sort', 'email');
                    this.grid.startup();
                } else {
                    this.grid.set('store', getStore());
                }
            },
            editUser: function (item) {
                // summary:
                //      creates a new UserAdminUser widget
                // item: Object
                //      row item as returned from the grid
                console.log('ijit/widget/authentication/UserAdmin:editUser', arguments);
            
                var userAdmin = new UserAdminUser(lang.mixin(item, {
                    adminToken: this.login.user.adminToken,
                    appName: this.appName,
                    roles: this.roles
                }));
                userAdmin.startup();
                userAdmin.on('edit', lang.partial(lang.hitch(this, 'getUsers'), true));
            },
            onError: function(response) {
                // summary:
                //      error callback for xhr
                // response: {}
                //      response object from server
                console.log('ijit/widgets/authentication/UserAdmin:onError', arguments);

                this.errMsgDiv.innerHTML = response.message;
                domStyle.set(this.errMsgDiv, 'display', 'block');
            },
            showWaitingUsers: function(response) {
                // summary:
                //      callback from getallwaiting
                //      builds user widgets
                // response: {}
                //      response object from server
                console.log('ijit/widgets/authentication/UserAdmin:showWaitingUsers', arguments);

                var users = response.result;

                if (users.length === 0) {
                    domStyle.set(this.noUsersMsg, 'display', 'block');
                } else {
                    array.forEach(users, function(u) {
                        new UserAdminPendingUser(lang.mixin(u, {
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
                console.log('ijit/widgets/authentication/UserAdmin:destroyRecursive', arguments);

                this.login.destroyRecursive();
                this.inherited(arguments);
            }
        });
    });
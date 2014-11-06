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
    'dojo/string',
    'dojo/Deferred',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'dgrid/OnDemandGrid',

    'jquery',
    'ijit/widgets/authentication/LoginRegister',
    'ijit/widgets/authentication/_UserAdminPendingUser',
    'ijit/widgets/authentication/_UserAdminUser'
], function(
    declare,
    lang,
    array,

    template,

    request,
    domStyle,
    domConstruct,
    Memory,
    topic,
    dojoString,
    Deferred,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    Grid,

    jquery,
    LoginRegister,
    UserAdminPendingUser,
    UserAdminUser
) {
    var fieldNames = {
        id: 'userId',
        email: 'email',
        role: 'role',
        lastLogin: 'lastLogin',
        first: 'first',
        last: 'last',
        agency: 'agency',
        startDate: 'startDate',
        endDate: 'endDate'
    };
    var formatDate = function (value) {
        if (value > 0) {
            return new Date(parseInt(value, 10)).toLocaleString();
        } else {
            return '';
        }
    };

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

        fieldNames: fieldNames,

        // dateFields: string[]
        //      list of date fields for csv export
        dateFields: [fieldNames.lastLogin, fieldNames.startDate, fieldNames.endDate],

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
                    idProperty: that.fieldNames.email,
                    query: function (query, options){
                        query = query || {};
                        options = options || {};

                        // this block is to make the sorting of strings case-insensitive
                        // it overrides the default sort logic adding in the .toLowerCase stuff
                        if (options.sort) {
                            var sort = options.sort[0];
                            options.sort = function (a, b) {
                                a = dojoString.trim(a[sort.attribute]).toLowerCase();
                                b = dojoString.trim(b[sort.attribute]).toLowerCase();

                                /* jshint -W018 */
                                return !!sort.descending === (a > b) ? -1 : 1;
                                /* jshint +W018 */
                            };
                        }
                        return this.queryEngine(query, options)(this.data);
                    }
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
                            formatter: formatDate
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

            // deferred makes custom approvals possible
            // check app/security/_UserAdminPendingUser in deq-enviro
            // for an example
            var def = new Deferred();
            var that = this;
        
            var userAdmin = new UserAdminUser(lang.mixin(item, {
                adminToken: this.login.user.adminToken,
                appName: this.appName,
                roles: this.roles
            }));
            userAdmin.startup();
            userAdmin.on('edit', function () {
                that.getUsers(true);
                def.resolve();
            });

            return def;
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
                        appName: this.appName,
                        userAdmin: this
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
        },
        exportToCsv: function () {
            // summary:
            //      Exports the user list to a csv file for download
            console.log('ijit/widgets/authentication/UserAdmin:exportToCsv', arguments);
        
            var csvTxt;
            var that = this;

            var users = this.grid.store.data;
            var firstUser = users[0];

            // polyfill for IE < 9
            if (!Array.isArray) {
                Array.isArray = function (arg) {
                    return Object.prototype.toString.call(arg) === '[object Array]';
                };
            }

            var walkObject = function (obj, header) {
                var values = [];
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if (typeof obj[prop] !== 'object' || Array.isArray(obj[prop])) {
                            // skip admin token
                            if (prop === 'adminToken') {
                                continue;
                            }
                            var v = (header) ? prop : obj[prop];

                            if (array.indexOf(that.dateFields, prop) !== -1) {
                                v = formatDate(v);
                            }
                            values.push('"' + v + '"');
                        } else {
                            values = values.concat(walkObject(obj[prop], header));
                        }
                    }
                }
                return values;
            };
            
            csvTxt = walkObject(firstUser, true).join(',') + '\n';

            var data = array.map(users, function (u) {
                return walkObject(u, false);
            });
            csvTxt += data.join('\n');

            var uri = encodeURI('data:text/csv;charset=utf-8,' + csvTxt);

            if (this.downloadLink.download === '') {
                this.downloadLink.href = uri;
                this.downloadLink.download = 'users.csv';
                this.downloadLink.click();
            } else {
                var newWindow = window.open();
                newWindow.document.writeln(csvTxt);
            }

            return csvTxt;
        }
    });
});
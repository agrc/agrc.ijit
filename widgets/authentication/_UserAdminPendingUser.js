define([
        'dojo/_base/declare',
        'dojo/_base/array',
        'dojo/_base/lang',
        'dojo/_base/fx',

        'dojo/dom-construct',
        'dojo/dom-style',
        'dojo/request',
        'dojo/topic',

        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',

        'dojo/text!ijit/widgets/authentication/templates/_UserAdminPendingUser.html'
    ],

    function(
        declare,
        array,
        lang,
        fx,

        domConstruct,
        domStyle,
        request,
        topic,

        _WidgetBase,
        _TemplatedMixin,
        _WidgetsInTemplateMixin,

        template
    ) {
        // summary:
        //      A widget associated with a user that is awaiting approval that allows an 
        //      admin to accept and assign a role or reject.
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            widgetsInTemplate: false,
            templateString: template,
            baseClass: 'user-admin-pending-user',

            urls: {
                base: '/permissionproxy/api',
                accept: '/admin/accept',
                reject: '/admin/reject'
            },

            // successColor: String
            successColor: 'rgb(223, 240, 216)',

            // successTopic: String
            //      topic fired when action is successfully completed
            successTopic: '_UserAdminPendingUser.success',


            // parameters passed into constructor

            // appName: String
            appName: null,

            // first: String
            //      User's first name
            first: null,

            // last: String
            //      User's last name
            last: null,

            // email: String
            //      user's email
            email: null,

            // agency: String
            //      user's agency
            agency: null,

            // roles: String[]
            //      an array of available roles that this user can be assigned to.
            roles: null,

            // adminToken: String
            adminToken: null,

            constructor: function() {
                console.log('ijit/widgets/authentication/_UserAdminPendingUser:constructor', arguments);
            },
            postCreate: function() {
                // summary:
                //      dom is ready
                console.log('ijit/widgets/authentication/_UserAdminPendingUser:postCreate', arguments);

                var that = this;
                array.forEach(this.roles, function(role) {
                    domConstruct.create('button', {
                        'class': 'btn btn-default',
                        innerHTML: role,
                        onclick: function() {
                            that.assignRole(role);
                        }
                    }, that.roleBtnGroup);
                });
            },
            assignRole: function(role) {
                // summary:
                //      fires the accept service with the passed in role
                // role: String
                console.log('ijit/widgets/authentication/_UserAdminPendingUser:assignRole', arguments);

                request(this.urls.base + this.urls.accept, {
                    data: JSON.stringify({
                        email: this.email,
                        role: role,
                        application: this.appName,
                        adminToken: this.adminToken
                    }),
                    method: 'PUT',
                    handleAs: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(lang.hitch(this, 'onSuccess'), lang.hitch(this, 'onError'));
            },
            onSuccess: function() {
                // summary:
                //      description
                console.log('ijit/widgets/authentication/_UserAdminPendingUser:onSuccess', arguments);

                domStyle.set(this.wellDiv, 'backgroundColor', this.successColor);

                var that = this;

                fx.fadeOut({
                    node: this.domNode,
                    duration: 1000,
                    onEnd: function() {
                        that.destroy();
                    }
                }).play();

                topic.publish(this.successTopic);
            },
            onError: function(response) {
                // summary:
                //      error callback for xhr request
                // response: {}
                //      response object returned by server
                console.log('ijit/widgets/authentication/_UserAdminPendingUser:onError', arguments);

                this.errMsgDiv.innerHTML = response.message;
                domStyle.set(this.errMsgDiv, 'display', 'block');
            },
            reject: function() {
                // summary:
                //      calls the reject service
                console.log('ijit/widgets/authentication/_UserAdminPendingUser:reject', arguments);

                request(this.urls.base + this.urls.reject, {
                    data: JSON.stringify({
                        email: this.email,
                        application: this.appName,
                        adminToken: this.adminToken
                    }),
                    method: 'DELETE',
                    handleAs: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(lang.hitch(this, 'onSuccess'), lang.hitch(this, 'onError'));
            }
        });
    });
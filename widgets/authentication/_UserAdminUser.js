define([
    'dojo/text!./templates/_UserAdminUser.html',

    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/request/xhr',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'ijit/modules/_ErrorMessageMixin',


    'bootstrap'
], function(
    template,

    declare,
    array,
    lang,
    domConstruct,
    xhr,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    _ErrorMessageMixin
) {
    var baseUrl = '/permissionproxy/api/';
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _ErrorMessageMixin], {
        // description:
        //      Dialog for viewing and editing user properties.

        templateString: template,
        baseClass: 'user-admin-user modal fade',
        widgetsInTemplate: true,

        urls: {
            edit: baseUrl + 'admin/edit',
            reset: baseUrl + 'user/resetpassword',
            del: baseUrl + 'admin/reject'
        },

        // Properties to be sent into constructor

        // userId: String
        userId: null,

        // email: String
        email: null,

        // first: String
        first: null,

        // last: String
        last: null,

        // role: String
        role: null,

        // roles: String[]
        roles: null,

        // agency: String
        agency: null,

        // adminToken: String
        adminToken: null,

        // appName: String
        appName: null,

        postCreate: function() {
            // summary:
            //      Overrides method of same name in dijit._Widget.
            // tags:
            //      private
            console.log('ijit.widgets.authentication._UserAdminUser::postCreate', arguments);

            $(this.domNode).modal();

            this.setupConnections();

            var that = this;
            array.forEach(this.roles, function (r) {
                domConstruct.create('option', {
                    value: r,
                    innerHTML: r
                }, that.roleSelect);
            });
            this.roleSelect.value = this.role;

            this.inherited(arguments);
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('ijit.widgets.authentication._UserAdminUser::setupConnections', arguments);

            $(this.domNode).on('hidden.bs.modal', lang.hitch(this, 'destroy'));
        },
        close: function () {
            // summary:
            //      closes the dialog and destroys this widget
            console.log('ijit/widgets/authentication/_UserAdminUser:close', arguments);
        
            $(this.domNode).modal('hide');
        },
        update: function () {
            // summary:
            //      sends data to the update service
            console.log('ijit/widgets/authentication/_UserAdminUser:update', arguments);

            this.hideErrMsg();
            
            var that = this;
            xhr.put(this.urls.edit, {
                handleAs: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    adminToken: this.adminToken,
                    userId: this.userId,
                    email: this.emailTxt.value,
                    first: this.firstTxt.value,
                    last: this.lastTxt.value,
                    role: this.roleSelect.value,
                    agency: this.agencyTxt.value,
                    application: this.appName
                })
            }).then(function () {
                that.onEdit();
                that.close();
            }, function (er) {
                that.showErrMsg(er.message);
            });
        },
        onEdit: function () {
            // summary:
            //      event for UserAdmin to listen to
            console.log('ijit/widgets/authentication/_UserAdminUser:onEdit', arguments);
        
        },
        validate: function () {
            // summary:
            //      validates the form and enables the submit button if valid
            console.log('ijit/widgets/authentication/_UserAdminUser:validate', arguments);
        
            this.toggleEnabled(this.isValid());

            this.hideErrMsg();
        },
        toggleEnabled: function (enable) {
            // summary:
            //      toggles the disabled property on the submit button
            // enable: Boolean
            console.log('ijit/widgets/authentication/_UserAdminUser:toggleEnabled', arguments);
        
            this.submitBtn.disabled = !enable;
        },
        isValid: function () {
            // summary:
            //      checks to see if there were any changes and if values are valid
            console.log('ijit/widgets/authentication/_UserAdminUser:isValid', arguments);
        
            return !(
                this.emailTxt.value === this.email &&
                this.firstTxt.value === this.first &&
                this.lastTxt.value === this.last &&
                this.roleSelect.value === this.role &&
                this.agencyTxt.value === this.agency
            ) && (
                this.emailTxt.value.length > 0 &&
                this.firstTxt.value.length > 0 &&
                this.lastTxt.value.length > 0 &&
                this.roleSelect.value.length > 0 &&
                this.agencyTxt.value.length > 0
            );
        },
        deleteUser: function() {
            // summary:
            //      fires when the user clicks the delete button
            console.log('ijit/widgets/authentication/_UserAdminUser:deleteUser', arguments);

            this.sendRequest(this.urls.del, 'DELETE');
        },
        resetPassword: function() {
            // summary:
            //      fires when the user clicks on the reset button
            console.log('ijit/widgets/authentication/_UserAdminUser:resetPassword', arguments);

            this.sendRequest(this.urls.reset, 'PUT');
        },
        sendRequest: function(service, verb) {
            // summary:
            //      send reset or delete request
            console.log('ijit/widgets/authentication/UserAdmin:sendRequest', arguments);

            this.hideErrMsg();

            var that = this;
            xhr(service, {
                data: JSON.stringify({
                    email: this.emailTxt.value,
                    application: this.appName,
                    adminToken: this.adminToken
                }),
                handleAs: 'json',
                method: verb,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function() {
                that.close();
                that.onEdit();
            }, function(response) {
                that.showErrMsg(response.message);
            });
        }
    });
});
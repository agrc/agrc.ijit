define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-style',
    'dojo/dom-construct',
    'dojo/request',

    'dojo/text!./templates/_LoginRegisterLogout.html',

    'ijit/widgets/authentication/_LoginRegisterPaneMixin',

    'bootstrap'

], function(
    declare,
    lang,
    domStyle,
    domConstruct,
    xhr,

    template,

    _LoginRegisterPaneMixin
) {
    // summary:
    //      A widget that provides log out and user name display for the LoginRegister widget.
    return declare([_LoginRegisterPaneMixin], {
        widgetsInTemplate: false,
        templateString: template,
        baseClass: 'login-register-logout',

        // mismatchedErrMsg: String
        //      The message displayed when the new password and confirm password do not match
        mismatchedErrMsg: '"New Password" and "Confirm New Password" do not match!',

        // passed in via the constructor

        // firstName: String
        //      The user's first name as displayed in the dropdown link
        firstName: null,

        // lastName: String
        //      The user's last name as displayed in the dropdown link
        lastName: null,

        // role: String
        //      The user's role. Determines the visibility of the user admin link
        role: null,

        // email: String
        //      The user's email.
        email: null,

        // url: String
        //      the url to the change password
        url: null,

        // xhrMethod: String
        //      The method to use with the xhr request for change password
        xhrMethod: 'PUT',

        // parentWidget: LoginRegister
        parentWidget: null,

        postCreate: function() {
            // summary:
            //      description
            console.log('ijit/widgets/authentication/_LoginRegisterLogout:postCreate', arguments);

            if (this.role === 'admin') {
                domStyle.set(this.adminLink, 'display', 'list-item');
            }

            domConstruct.place(this.modalDiv, document.body);

            this.inherited(arguments);
        },
        onSignOutClick: function(evt) {
            // summary:
            //      fires when the user clicks the "Sign out" menu item
            // evt: Click Event
            console.log('ijit/widgets/authentication/_LoginRegisterLogout:onSignOutClick', arguments);

            evt.preventDefault();

            return xhr(this.parentWidget.urls.base + this.parentWidget.urls.forgetme)
                .always(lang.hitch(this, 'refreshPage'));
        },
        refreshPage: function() {
            // summary:
            //      wrapper around window.location.reload to enable testing since 
            //      it's immutable
            console.log('ijit/widgets/authentication/_LoginRegisterLogout:refreshPage', arguments);

            window.location.reload();
        },
        onChangePasswordClick: function (evt) {
            // summary:
            //      description
            // evt: Click Event
            console.log('ijit/widgets/authentication/_LoginRegisterLogout:onChangePasswordClick', arguments);
        
            evt.preventDefault();

            $(this.modalDiv).modal('show');

            this.focusFirstInput();
        },
        getData: function () {
            // summary:
            //      returns data suitable for submission to the change password service
            //      also validates that the new password fields match
            console.log('ijit/widgets/authentication/_LoginRegisterLogout:getData', arguments);

            if (this.newPassTxt.value !== this.newPassConfirmTxt.value) {
                throw this.mismatchedErrMsg;
            }
        
            return {
                email: this.email,
                currentPassword: this.currentPassTxt.value,
                newpassword: this.newPassTxt.value,
                newpasswordrepeated: this.newPassConfirmTxt.value
            };
        },
        onSubmitReturn: function () {
            // summary:
            //      callback for successful xhr request
            console.log('ijit/widgets/authentication/_LoginRegisterLogout:onSubmitReturn', arguments);
        
            domStyle.set(this.form, 'display', 'none');
            domStyle.set(this.successDiv, 'display', 'block');
            domStyle.set(this.submitBtn, 'display', 'none');
        },
        destroy: function () {
            // summary:
            //      overridden for unit test clean up
            console.log('ijit/widgets/authentication/_LoginRegisterLogout:destroy', arguments);
        
            domConstruct.destroy(this.modalDiv);

            this.inherited(arguments);
        }
    });
});
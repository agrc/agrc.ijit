define([
    'dojo/_base/declare',
    'dojo/text!./templates/_LoginRegisterLogout.html',
    'dojo/dom-style',
    'ijit/widgets/authentication/_LoginRegisterPaneMixin',
    'dojo/dom-construct',
    'dojo/_base/window',
    'bootstrap'

], function(
    declare,
    template,
    domStyle,
    _LoginRegisterPaneMixin,
    domConstruct,
    win
) {
    // summary:
    //      A widget that provides log out and user name display for the LoginRegister widget.
    return declare('ijit/widget/authentication/_LoginRegisterLogout', [_LoginRegisterPaneMixin], {
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

        // parentWidget: LoginRegister
        parentWidget: null,

        postCreate: function() {
            // summary:
            //      description
            console.log(this.declaredClass + '::postCreate', arguments);

            if (this.role === 'admin') {
                domStyle.set(this.adminLink, 'display', 'list-item');
            }

            domConstruct.place(this.modalDiv, win.body());

            this.inherited(arguments);
        },
        onSignOutClick: function(evt) {
            // summary:
            //      fires when the user clicks the "Sign out" menu item
            // evt: Click Event
            console.log(this.declaredClass + "::onSignOutClick", arguments);

            evt.preventDefault();

            this.refreshPage();
        },
        refreshPage: function() {
            // summary:
            //      wrapper around window.location.reload to enable testing since 
            //      it's immutable
            console.log(this.declaredClass + "::refreshPage", arguments);

            window.location.reload();
        },
        onChangePasswordClick: function (evt) {
            // summary:
            //      description
            // evt: Click Event
            console.log(this.declaredClass + '::onChangePasswordClick', arguments);
        
            evt.preventDefault();

            $(this.modalDiv).modal('show');

            this.focusFirstInput();
        },
        getData: function () {
            // summary:
            //      returns data suitable for submission to the change password service
            //      also validates that the new password fields match
            console.log(this.declaredClass + '::getData', arguments);

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
            console.log(this.declaredClass + '::onSubmitReturn', arguments);
        
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
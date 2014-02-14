define([
    'dojo/text!./templates/_LoginRegisterRequestPane.html',

    'dojo/_base/declare',

    'dojo/dom-style',

    'ijit/widgets/authentication/_LoginRegisterPaneMixin'

], function(
    template,

    declare,

    domStyle,

    _LoginRegisterPaneMixin
) {
    // summary:
    //      The request access pane in the LoginRegistration widget.
    return declare([_LoginRegisterPaneMixin], {
        templateString: template,
        baseClass: 'login-register-request-pane',

        mismatchedEmailMsg: 'Your emails do not match!',
        mismatchedPasswordMsg: 'Your passwords do not match!',
        xhrMethod: 'POST',


        getData: function() {
            // summary:
            //      returns the data from the form as an object suitable
            //      for submission to the web service
            console.log('ijit/widgets/authentication/_LoginRegisterRequestPane:getData', arguments);

            if (this.emailTxt.value !== this.emailConfirmTxt.value) {
                throw this.mismatchedEmailMsg;
            } else if (this.passwordTxt.value !== this.passwordConfirmTxt.value) {
                throw this.mismatchedPasswordMsg;
            }

            return {
                first: this.fNameTxt.value,
                last: this.lNameTxt.value,
                agency: this.agencyTxt.value,
                email: this.emailTxt.value,
                password: this.passwordTxt.value
            };
        },
        onSubmitReturn: function() {
            // summary:
            //      callback for xhr
            console.log('ijit/widgets/authentication/_LoginRegisterRequestPane:onSubmitReturn', arguments);

            domStyle.set(this.submitBtn, 'display', 'none');

            this.showSuccessMsg();
        }
    });
});
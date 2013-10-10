define([
        'dojo/text!./templates/_LoginRegisterRequestPane.html',

        'dojo/_base/declare',

        'ijit/widgets/authentication/_LoginRegisterPaneMixin'
    ],

    function(
        template,

        declare,

        _LoginRegisterPaneMixin
    ) {
        // summary:
        //      The request access pane in the LoginRegistration widget.
        return declare('ijit/widgets/authentication/_LoginRegisterRequestPane', [_LoginRegisterPaneMixin], {
            templateString: template,
            baseClass: 'login-register-request-pane',

            mismatchedEmailMsg: 'Your emails do not match!',
            mismatchedPasswordMsg: 'Your passwords do not match!',
            xhrMethod: 'POST',


            getData: function() {
                // summary:
                //      returns the data from the form as an object suitable
                //      for submission to the web service
                console.log(this.declaredClass + "::getData", arguments);

                if (this.emailTxt.value !== this.emailConfirmTxt.value) {
                    throw this.mismatchedEmailMsg;
                } else if (this.passwordTxt.value !== this.passwordConfirmTxt.value) {
                    throw this.mismatchedPasswordMsg;
                }

                return {
                    name: this.nameTxt.value,
                    agency: this.agencyTxt.value,
                    email: this.emailTxt.value,
                    password: this.passwordTxt.value
                };
            },
            onSubmitReturn: function() {
                // summary:
                //      callback for xhr
                console.log(this.declaredClass + "::onSubmitReturn", arguments);

                this.showSuccessMsg();
            }
        });
    });
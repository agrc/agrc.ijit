define([
        'dojo/text!./templates/_LoginRegisterSignInPane.html',

        'dojo/_base/declare',

        'dojo/on',

        'ijit/widgets/authentication/_LoginRegisterPaneMixin'
    ],

    function(
        template,

        declare,

        on,

        _LoginRegisterPaneMixin
    ) {
        // summary:
        //      The sign in pane for the LoginRegistration widget.
        return declare('ijit/widgets/authentication/_LoginRegisterSignInPane', [_LoginRegisterPaneMixin], {
            templateString: template,
            baseClass: 'login-register-sign-in-pane',
            xhrMethod: 'POST',

            getData: function() {
                // summary:
                //      gets the data from the form as an object suitable for
                //      submission to the web service
                console.log(this.declaredClass + '::getData', arguments);

                return {
                    email: this.emailTxt.value,
                    password: this.passwordTxt.value,
                    persist: this.rememberMeChbx.checked
                };
            },
            onSubmitReturn: function(returnValue) {
                // summary:
                //      callback for sign in xhr
                // returnValue: JSON Object
                console.log(this.declaredClass + '::onSubmitReturn', arguments);

                this.parentWidget.token = returnValue.result.token.token;
                this.parentWidget.tokenExpireDate = new Date(returnValue.result.token.expires);

                this.parentWidget.user = returnValue.result.user;

                this.parentWidget.hideDialog();

                //this emits a buttugly object. change it to on.emit to see the other
                //pretty option. It breaks the tests though.
                this.emit('sign-in-success', returnValue.result);
            },
            onSubmitError: function () {
                // summary:
                //      description
                console.log(this.declaredClass + '::onSubmitError', arguments);
            
                this.parentWidget.forgotPane.emailTxt.value = this.emailTxt.value;
                this.parentWidget.forgotPane.submitBtn.disabled = false;

                this.inherited(arguments);
            }
        });
    });
define([
        'dojo/text!./templates/_LoginRegisterSignInPane.html',

        'dojo/_base/declare',

        'dojo/on',

        'ijit/widgets/_LoginRegisterPaneMixin'
    ],

    function(
        template,

        declare,

        on,

        _LoginRegisterPaneMixin
    ) {
        // summary:
        //      The sign in pane for the LoginRegistration widget.
        return declare('ijit/widgets/_LoginRegisterSignInPane', [_LoginRegisterPaneMixin], {
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
                    password: this.passwordTxt.value
                };
            },
            onSubmitReturn: function(returnValue) {
                // summary:
                //      callback for sign in xhr
                // returnValue: JSON Object
                console.log(this.declaredClass + '::onSubmitReturn', arguments);

                this.parentWidget.token = returnValue.result.token;

                this.parentWidget.hideDialog();

                //this emits a buttugly object. change it to on.emit to see the other
                //pretty option. It breaks the tests though.
                this.emit('sign-in-success', returnValue.result);
            }
        });
    });
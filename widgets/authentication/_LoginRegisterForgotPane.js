define([
        'dojo/text!./templates/_LoginRegisterForgotPane.html',

        'dojo/_base/declare',
        'dojo/dom-style',

        'ijit/widgets/authentication/_LoginRegisterPaneMixin'
    ],

    function(
        template,

        declare,
        domStyle,

        _LoginRegisterPaneMixin
    ) {
        // summary:
        //      The forgot password pane in the LoginRegistration widget.
        return declare([_LoginRegisterPaneMixin], {
            templateString: template,
            baseClass: 'login-register-forgot-pane',
            xhrMethod: 'PUT',

            getData: function() {
                // summary:
                //      returns the values form the form in an object suitable 
                //      for submitting to the web service
                console.log('ijit/widgets/authentication/_LoginREgisterForgotPane:getData', arguments);

                return {
                    email: this.emailTxt.value
                };
            },
            onSubmitReturn: function() {
                // summary:
                //      callback for xhr
                console.log('ijit/widgets/authentication/_LoginREgisterForgotPane:onSubmitReturn', arguments);

                this.showSuccessMsg();

                domStyle.set(this.submitBtn, 'display', 'none');
            }
        });
    });
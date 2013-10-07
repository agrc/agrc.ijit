define([
    'dojo/text!./templates/_LoginRegisterForgotPane.html',

    'dojo/_base/declare', 

    'ijit/widgets/_LoginRegisterPaneMixin'
],

function (
    template,

    declare, 

    _LoginRegisterPaneMixin
    ) {
    // summary:
    //      The forgot password pane in the LoginRegistration widget.
    return declare('ijit/widgets/_LoginRegisterForgotPane', 
        [_LoginRegisterPaneMixin], {
        templateString: template,
        baseClass: 'login-register-forgot-pane',
        xhrMethod: 'PUT',

        getData: function () {
            // summary:
            //      returns the values form the form in an object suitable 
            //      for submitting to the web service
            console.log(this.declaredClass + "::getData", arguments);
        
            return {
                email: this.emailTxt.value
            };
        },
        onSubmitReturn: function () {
            // summary:
            //      callback for xhr
            console.log(this.declaredClass + "::onSubmitReturn", arguments);
        
            this.showSuccessMsg();
        }
    });
});
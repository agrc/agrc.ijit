define([
    'dojo/_base/declare',
    'dojo/query',
    'dojo/dom-style',
    'dojo/request',
    'dojo/_base/lang',

    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin', 
    'dijit/_WidgetsInTemplateMixin'
],

function (
    declare,
    query,
    domStyle,
    xhr,
    lang,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin
    ) {
    // summary:
    //      A mixin for shared code between the panes in LoginRegistration
    return declare('ijit/widgets/_LoginRegisterPaneMixin', 
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,

        // parameters passed in via the constructor

        // url: String
        //      The url to the endpoint that the data from the form
        //      is to be submitted.
        url: null,

        // parentWidget: ijit/widgets/LoginRegistration
        //      a reference to the parent widget
        parentWidget: null,
        
        validate: function () {
            // summary:
            //      validates email and password values
            // returns: Boolean
            console.log(this.declaredClass + "::validate", arguments);
        
            var valid = query(
                "input[type='text'], input[type='password'], input[type='email']", 
                this.domNode
                ).every(function (node) {
                    return node.value.length > 0;
                });

            this.submitBtn.disabled = !valid;

            return valid;
        },
        showError: function (txt) {
            // summary:
            //      shows an alert with the passed in message
            // txt: String
            console.log(this.declaredClass + "::showError", arguments);
        
            this.errorDiv.innerHTML = txt;
            domStyle.set(this.errorDiv, 'display', 'block');
            // domStyle.set(this.progressBar, 'display', 'none'); // see template
        },
        hideError: function () {
            // summary:
            //      hides the error message div
            console.log(this.declaredClass + "::hideError", arguments);
        
            domStyle.set(this.errorDiv, 'display', 'none');
            // domStyle.set(this.progressBar, 'display', 'block'); // see template
        },
        goToRequestPane: function (evt) {
            // summary:
            //      fires when the user clicks on the Request pane
            // evt: Event
            console.log(this.declaredClass + "::goToRequestPane", arguments);
        
            evt.preventDefault();

            this.parentWidget.goToPane(this.parentWidget.requestPane);
        },
        goToForgotPane: function (evt) {
            // summary:
            //      fires when the user clicks on the "forgot password" link
            // evt: Click Event
            console.log(this.declaredClass + "::goToForgotPane", arguments);
        
            evt.preventDefault();

            this.parentWidget.goToPane(this.parentWidget.forgotPane);
        },
        goToSignInPane: function (evt) {
            // summary:
            //      fires when the user click on the "Sign In" link
            // evt: Click Event Object
            console.log(this.declaredClass + "::goToSignInPane", arguments);
        
            evt.preventDefault();

            this.parentWidget.goToPane(this.parentWidget.signInPane);
        },
        onSubmitClick: function () {
            // summary:
            //      fires when the user clicks the sign in button
            console.log(this.declaredClass + "::onSubmitClick", arguments);
        
            this.submitBtn.disabled = true;

            this.hideError();

            var that = this;
            try {
                xhr(this.url, {
                    data: JSON.stringify(lang.mixin(this.getData(), {
                        application: AGRC.appName
                    })),
                    handleAs: 'json',
                    method: this.xhrMethod,
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }).then(
                    lang.hitch(this, 'onSubmitReturn'), 
                    lang.hitch(this, 'onSubmitError')
                ).always(function () {
                    that.submitBtn.disabled = false;
                });
            } catch (e) {
                this.showError(e);
            }
        },
        onSubmitError: function (err) {
            // summary:
            //      error callback for xhr
            // err: Error Object
            console.log(this.declaredClass + "::onSubmitError", arguments);
        
            this.showError(err.response.data.message);
        },
        focusFirstInput: function () {
            // summary:
            //      focuses the first input in the form
            console.log(this.declaredClass + "::focusFirstInput", arguments);
        
            query('input', this.domNode)[0].focus();
        },
        showSuccessMsg: function () {
            // summary:
            //      shows the successDiv
            console.log(this.declaredClass + "::showSuccessMsg", arguments);
        
            domStyle.set(this.form, 'display', 'none');
            domStyle.set(this.successDiv, 'display', 'block');
        }
    });
});
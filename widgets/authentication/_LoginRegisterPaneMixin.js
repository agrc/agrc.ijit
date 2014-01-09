require({
    aliases: [
        ['spin', 'ijit/resources/libs/ladda-bootstrap/spin.js']
    ]
});
define([
        'dojo/_base/declare',
        'dojo/_base/lang',

        'dojo/dom-style',
        'dojo/dom-attr',

        'dojo/query',
        'dojo/request',
        'dojo/keys',

        '../../resources/libs/ladda-bootstrap/ladda',

        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin'
    ],

    function(
        declare,
        lang,

        domStyle,
        domAttr,

        query,
        xhr,
        keys,

        Ladda,

        _WidgetBase,
        _TemplatedMixin,
        _WidgetsInTemplateMixin
    ) {
        // summary:
        //      A mixin for shared code between the panes in LoginRegistration
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            widgetsInTemplate: true,

            // parameters passed in via the constructor

            // url: String
            //      The url to the endpoint that the data from the form
            //      is to be submitted.
            url: null,

            // parentWidget: ijit/widgets/authentication/LoginRegistration
            //      a reference to the parent widget
            parentWidget: null,

            // status: Ladda
            //      Ladda reference to button for stopping and starting loading indicator
            status: null,

            postCreate: function () {
                // summary:
                //      dom is ready
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:postCreate', arguments);
            
                this.status = Ladda.create(this.submitBtn);
            },
            validate: function(evt) {
                // summary:
                //      validates email and password values on keyup event
                // returns: Boolean
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:validate', arguments);

                var valid = query(
                    "input[type='text'], input[type='password'], input[type='email']",
                    this.domNode
                ).every(function(node) {
                    return node.value.length > 0;
                });
                
                this.submitBtn.disabled = !valid;

                var charOrCode = evt.charCode || evt.keyCode;
                if (valid && charOrCode == keys.ENTER) {
                    this.onSubmitClick();
                }

                return valid;
            },
            showError: function(txt) {
                // summary:
                //      shows an alert with the passed in message
                // txt: String
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:showError', arguments);

                this.errorDiv.innerHTML = txt;
                domStyle.set(this.errorDiv, 'display', 'block');
                this.status.stop();
            },
            hideError: function() {
                // summary:
                //      hides the error message div
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:hideError', arguments);

                domStyle.set(this.errorDiv, 'display', 'none');
            },
            goToRequestPane: function(evt) {
                // summary:
                //      fires when the user clicks on the Request pane
                // evt: Event
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:goToRequestPane', arguments);

                evt.preventDefault();

                this.parentWidget.goToPane(this.parentWidget.requestPane);
            },
            goToForgotPane: function(evt) {
                // summary:
                //      fires when the user clicks on the "forgot password" link
                // evt: Click Event
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:goToForgotPane', arguments);

                evt.preventDefault();

                this.parentWidget.goToPane(this.parentWidget.forgotPane);
            },
            goToSignInPane: function(evt) {
                // summary:
                //      fires when the user click on the "Sign In" link
                // evt: Click Event Object
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:goToSignInPane', arguments);

                evt.preventDefault();

                this.parentWidget.goToPane(this.parentWidget.signInPane);
            },
            onSubmitClick: function() {
                // summary:
                //      fires when the user clicks the sign in button
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:onSubmitClick', arguments);

                domAttr.set(this.submitBtn, 'disabled', true);
                this.status.start();

                this.hideError();

                var that = this;
                try {
                    var def = xhr(this.url, {
                        data: JSON.stringify(lang.mixin(this.getData(), {
                            application: this.parentWidget.appName
                        })),
                        handleAs: 'json',
                        method: this.xhrMethod,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(
                        lang.hitch(this, 'onSubmitReturn'),
                        lang.hitch(this, 'onSubmitError')
                    );
                    def.always(function() {
                        domAttr.remove(that.submitBtn, 'disabled');
                    });
                } catch (e) {
                    this.showError(e);
                }
            },
            onSubmitError: function(err) {
                // summary:
                //      error callback for xhr
                // err: Error Object
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:onSubmitError', arguments);

                this.showError(err.response.data.message);
            },
            focusFirstInput: function() {
                // summary:
                //      focuses the first input in the form
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:focusFirstInput', arguments);

                query('input', this.domNode)[0].focus();
            },
            showSuccessMsg: function() {
                // summary:
                //      shows the successDiv
                console.log('ijit/widgets/authentication/_LoginRegisterPaneMixin:showSuccessMsg', arguments);

                domStyle.set(this.form, 'display', 'none');
                domStyle.set(this.successDiv, 'display', 'block');
                this.status.stop();
            }
        });
    });

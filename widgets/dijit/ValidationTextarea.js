dojo.provide('ijit.widgets.dijit.ValidationTextarea');
dojo.require("dijit.form.SimpleTextarea");
dojo.require("dijit.form.ValidationTextBox");

dojo.declare(
    "ijit.widgets.dijit.ValidationTextarea",
    [dijit.form.ValidationTextBox, dijit.form.SimpleTextarea],
    {
        invalidMessage: "This field is required",

        postCreate: function () {
            this.inherited(arguments);
        },

        validate: function () {
            if (arguments.length == 0) {
                return this.validate(false);
            }
            return this.inherited(arguments);
        },

        onFocus: function () {
            if (!this.isValid()) {
                this.displayMessage(this.getErrorMessage());
            }
        },

        onBlur: function () {
            this.validate(false);
        }
    }
);
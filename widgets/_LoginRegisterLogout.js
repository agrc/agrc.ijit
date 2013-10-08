define([
    'dojo/_base/declare', 
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin', 
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!./templates/_LoginRegisterLogout.html'
],

function (
    declare, 
    _WidgetBase, 
    _TemplatedMixin, 
    _WidgetsInTemplateMixin, 
    template
    ) {
    // summary:
    //      A widget that provides log out and user name display for Lthe LoginRegister widget.
    return declare('ijit/widget/_LoginRegisterLogout', 
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: false,
        templateString: template,
        baseClass: 'login-register-logout',

        onSignOutClick: function (evt) {
            // summary:
            //      fires when the user clicks the "Sign out" menu item
            // evt: Click Event
            console.log(this.declaredClass + "::onSignOutClick", arguments);
        
            evt.preventDefault();

            this.refreshPage();
        },
        refreshPage: function () {
            // summary:
            //      wrapper around window.location.reload to enable testing since 
            //      it's immutable
            console.log(this.declaredClass + "::refreshPage", arguments);
        
            window.location.reload();
        }
    });
});
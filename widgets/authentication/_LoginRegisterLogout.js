define([
        'dojo/_base/declare',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',
        'dojo/text!./templates/_LoginRegisterLogout.html',
        'dojo/dom-style'
    ],

    function(
        declare,
        _WidgetBase,
        _TemplatedMixin,
        _WidgetsInTemplateMixin,
        template,
        domStyle
    ) {
        // summary:
        //      A widget that provides log out and user name display for Lthe LoginRegister widget.
        return declare('ijit/widget/authentication/_LoginRegisterLogout', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            widgetsInTemplate: false,
            templateString: template,
            baseClass: 'login-register-logout',

            // name: String
            //      The user's name as displayed in the dropdown link
            name: null,

            // role: String
            //      The user's role. Determines the visibility of the user admin link
            role: null,

            postCreate: function () {
                // summary:
                //      description
                console.log(this.declaredClass + '::postCreate', arguments);
            
                if (this.role === 'admin') {
                    domStyle.set(this.adminLink, 'display', 'list-item');
                }
            },
            onSignOutClick: function(evt) {
                // summary:
                //      fires when the user clicks the "Sign out" menu item
                // evt: Click Event
                console.log(this.declaredClass + "::onSignOutClick", arguments);

                evt.preventDefault();

                this.refreshPage();
            },
            refreshPage: function() {
                // summary:
                //      wrapper around window.location.reload to enable testing since 
                //      it's immutable
                console.log(this.declaredClass + "::refreshPage", arguments);

                window.location.reload();
            }
        });
    });
// // this is so that jquery is loaded before bootstrap
// require({
//     async: 0
// });

define([
    'dojo/_base/declare', 
    'dojo/_base/lang',
    'dojo/_base/window',

    'dojo/request',
    'dojo/dom-style',
    'dojo/dom-construct',

    'dojo/text!./templates/LoginRegister.html',

    'dijit/_TemplatedMixin', 
    'dijit/_WidgetBase', 
    'dijit/_WidgetsInTemplateMixin',

    'ijit/widgets/_LoginRegisterSignInPane',
    'ijit/widgets/_LoginRegisterRequestPane',
    'ijit/widgets/_LoginRegisterForgotPane',

    // no params
    'dijit/layout/StackContainer',
    'dijit/layout/ContentPane',
    'jquery/jquery'
],

function (
    declare, 
    lang,
    win,

    xhr,
    domStyle,
    domConstruct,

    template,

    _TemplatedMixin, 
    _WidgetBase, 
    _WidgetsInTemplateMixin,

    _LoginRegisterSignInPane,
    _LoginRegisterRequestPane,
    _LoginRegisterForgotPane
    ) {
    // summary:
    //      Works with agrc/ArcGisServerPermissionsProxy to allow users to register or login.
    // requires:
    //      jquery and bootstrap.js
    return declare('widgets/LoginRegister', 
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'login-register',

        // modal: Bootstrap Modal Dialog
        modal: null,

        // signInPane: _LoginRegisterSignInPane
        signInPane: null,

        // requestPane: _LoginRegisterRequestPane
        requestPane: null,

        // forgotPane: _LoginRegisterRequestPane
        forgotPane: null,

        urls: {
            base: '/permissionproxy/api',
            signIn: '/authenticate/user',
            request: '/user/register',
            reset: '/user/resetpassword'
        },


        // parameters passed in via the constructor

        // appName: String
        //      The name of the app in the permissionproxy database
        //      e.g. 'pel' for 'app_pel' in the raven database
        appName: null,


        postCreate: function () {
            // summary:
            //      dom is ready
            console.log(this.declaredClass + "::postCreate", arguments);

            // create panes
            this.signInPane = new _LoginRegisterSignInPane({
                url: this.urls.base + this.urls.signIn,
                parentWidget: this
            }, this.signInPaneDiv);
            this.requestPane = new _LoginRegisterRequestPane({
                url: this.urls.base + this.urls.request,
                parentWidget: this
            }, this.requestPaneDiv);
            this.forgotPane = new _LoginRegisterForgotPane({
                url: this.urls.base + this.urls.reset,
                parentWidget: this
            }, this.forgotPaneDiv);
            this.stackContainer.startup();

            domConstruct.place(this.domNode, win.body());

            var that = this;
            // this is to make sure that bootstrap is loaded after jQuery
            require(['bootstrap'], function () {
                that.modal = $(that.modalDiv).modal({
                    backdrop: 'static',
                    keyboard: false
                });

                // focus email text box when form is shown
                that.modal.on('shown.bs.modal', function () {
                    that.signInPane.emailTxt.focus();
                });

            });
        },
        goToPane: function (pane) {
            // summary:
            //      fires when the user clicks the "Request Access" link
            // pane: _LoginRegister*Pane
            console.log(this.declaredClass + "::goToPane", arguments);
        
            this.stackContainer.selectChild(pane);
            pane.focusFirstInput();
        },
        hideDialog: function () {
            // summary:
            //      hides the modal dialog
            console.log(this.declaredClass + "::hideDialog", arguments);
        
            $(this.modalDiv).modal('hide');
        }
    });
});
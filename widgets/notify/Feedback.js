/*global dojo, dijit, console, document, navigator*/

// provide namespace
dojo.provide('ijit.widgets.notify.Feedback');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dijit.form.DropDownButton');
dojo.require('dijit.TooltipDialog');

dojo.declare('ijit.widgets.notify.Feedback', [dijit._Widget, dijit._Templated], {
    // description:
    //      Widget that is placed in the upper left-hand corner of the map to allow
    //      the user to submit feedback for the current site.

    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,
    
    // templatePath: [private] String
    //      Path to template. See dijit._Templated
    templatePath: dojo.moduleUrl('ijit.widgets.notify', 'templates/Feedback.html'),
    
    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: 'agrc-feedback',

    // xhrArgs: {}
    //      The arguments sent with the request
    xhrArgs: {
        url: '/ArcGIS/rest/services/Toolbox/GPServer/Feedback/submitJob',
        handleAs: 'json'
    },
    
    // keyConnect: dojo.connect handle
    //      Used to store a reference for dojo.disconnect
    keyConnect: null,

    // errorTxt: String
    //      Message displayed when the xhr throws an error
    errorTxt: "There was an error sending your comments. You can submit them directly to <a href='mailto:mpeters@utah.gov'>mpeters@utah.gov</a> if you wish.",

    // successTxt: String
    //      Message displayed when the xhr is successful
    successTxt: 'Your comments have been submitted successfully!',


    // Parameters to constructor
    
    // map: esri.Map
    //      The map that you want the feedback widget to be placed in
    map: null,

    // appName: String
    //      The name of the app that you want this feedback associated with
    appName: null,

    // additionalText: String [optional]
    //      Any additional text that you want to show up at the top of the
    //      dialog box.
    additionalText: null,
    
    constructor: function(params, div) {
        // summary:
        //    Constructor method
        // params: Object
        //    Parameters to pass into the widget. Required values include:
        // div: String|DomNode
        //    A reference to the div that you want the widget to be created in.
        console.info(this.declaredClass + '::' + arguments.callee.nom, arguments);

        if (!params.appName){
            throw new Error('appName is required!');
        }
    },
    postCreate: function() {
        // summary:
        //    Overrides method of same name in dijit._Widget.
        //      Places the widget in the upper left-hand corner of the map container.
        //      Creates the tooltip dialog and hooks it to the drop down button.
        // tags:
        //    private
        console.info(this.declaredClass + '::' + arguments.callee.nom, arguments);

        // place in map container
        dojo.place(this.domNode, this.map.container);

        // create programmatically because declaratively doesn't work in widget templates
        var dialog = new dijit.TooltipDialog({
            content: this.dialogContent
        });
        this.ddButton.dropDown = dialog;

        this.wireEvents();

        if (!this.additionalText) {
            dojo.destroy(this.additionalTextContainer);
        }
    },
    wireEvents: function () {
        // summary:
        //      wires the events for the widget
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        this.connect(this.submitBtn, 'onClick', this.onSubmitClick);
        this.keyConnect = this.connect(this.comments, 'onkeyup', this.onMessageKeyUp);
    },
    onSubmitClick: function () {
        // summary:
        //      Fires when the user clicks on the submit button
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.submitBtn.set('disabled', true);

        var args = dojo.mixin({
            load: dojo.hitch(this, this.xhrLoad),
            error: dojo.hitch(this, this.xhrError),
            content: {
                f: 'json',
                appName: this.appName,
                email: this.email.value,
                message: this.comments.value,
                navigatorObject: dojo.toJson({
                    userAgent: navigator.userAgent,
                    platform: navigator.platform
                }),
                url: document.URL,
                otherData: '',
                sendEmail: true
            }
        }, this.xhrArgs);

        //don't do anything if on localhost
        if (document.domain !== 'localhost') {
            dojo.xhrGet(args);
        } else {
            console.info(dojo.toJson(args));
            this.xhrLoad({jobStatus: 'esriJobSubmitted'});
        }
    },
    onMessageKeyUp: function () {
        // summary:
        //      Fires when the user types into the message field.
        //      Enables the submit button
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        this.submitBtn.set('disabled', false);
        this.disconnect(this.keyConnect);
    },
    xhrLoad: function (response) {
        // summary:
        //      Callback for successful xhr
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        if (response.jobStatus === 'esriJobSubmitted') {
            // clear form and report successful
            this.clearForm();
            this.showMessage(this.successTxt);
        } else {
            this.xhrError();
        }
    },
    xhrError: function (response) {
        // summary:
        //      Callback for error xhr
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        this.showMessage(this.errorTxt, true);
        this.submitBtn.set('disabled', false);
    },
    showMessage: function (msg, error) {
        // summary:
        //      Displays the message in the dialog
        // msg: String
        // type: Boolean
        //      Changes the color to red.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        if (error) {
            dojo.addClass(this.msg, 'error');
            dojo.style(this.buttonContainer, 'height', '100px');
        } else {
            dojo.removeClass(this.msg, 'error');
        }

        this.msg.innerHTML = msg;
    },
    clearForm: function () {
        // summary:
        //      Clears the inputs and sets the submit button to disabled
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        this.email.value = '';
        this.comments.value = '';
        this.submitBtn.set('disabled', false);
    }
});
/*global dojo, console, document, navigator*/
dojo.provide("ijit.modules.ErrorLogger");

dojo.declare("ijit.modules.ErrorLogger", null, {
    // summary:
    //      An object which sends error reports to a web service that logs them to 
    //      text files and emails the project owner.
    
    // xhrArgs: {}
    //      The arguments sent to dojo xhr
    xhrArgs: {
        url: '/ArcGIS/rest/services/Toolbox/GPServer/LogError/submitJob',
        handleAs: 'json'
    },
    
    // properties passed via the constructor
    
    // appName: String
    //      The name of the application
    appName: null,
    
    // userName: String [optional]
    //      The userName
    userName: null,
    
    constructor: function(params) {
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        if (!params.appName){
            throw new Error('appName is required!');
        }
        
        dojo.mixin(this, params);
        
        this.initXHR();
    },
    initXHR: function(){
        // summary:
        //      Sets up the xhr post
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.xhrArgs.load = this.xhrLoad;
        this.xhrArgs.error = this.xhrError;
    },
    xhrLoad: function(response){
        // summary:
        //      Callback from xhr get
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    },
    xhrError: function(error){
        // summary:
        //      Error callback from xhr get
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    },
    log: function(er, otherData, sendEmail){
        // summary:
        //      Main logging function.
        // er: Error
        // otherData: String [optional]
        // sendEmail: Boolean [optional]
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        if (!er){
            throw 'er is required!';
        }
        
        this.xhrArgs.content = {
            f: 'json',
            appName: this.appName,
            errorObject: dojo.toJson(er),
            otherData: otherData || '',
            sendEmail: sendEmail || '',
            navigatorObject: this.getNavigatorData(),
            url: document.URL,
            userName: this.userName || ''
        };
        
        // don't do anything if on localhost
        if (document.domain !== 'localhost') {
            dojo.xhrGet(this.xhrArgs);
        } else {
            console.info(dojo.toJson(this.xhrArgs.content));
        }
    },
    getNavigatorData: function(){
        // summary:
        //      Compiles the data from the navigator object.
        // returns: String
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        return dojo.toJson({
            userAgent: navigator.userAgent,
            platform: navigator.platform
        });
    }
});
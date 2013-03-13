/*global dojo, ijit, console, esri*/
/*jslint sub:true*/
dojo.provide("ijit.modules.Identify");

//dojo.require('esri.dijit.Popup');

dojo.declare("ijit.modules.Identify", null, {
    // summary:
    //      quick and dirty identify for all layers in map service
    
    // iParams: esri.tasks.IdentifyParameters
    iParams: null,
    
    // iTask: esri.tasks.IdentifyTask
    iTask: null,
    
    // popup: esri.dijit.Popup
    popup: null,
    
    // map: agrc.widgets.map.BaseMap
    map: null,
    
    
    // Parameters passed in via the constructor
    
    // url: String
    url: null,
    
    // errorLogger: ijit.modules.ErrorLogger
    errorLogger: null,
    
    // popupParameters: {}
    //      Constructor parameters passed into esri.dijit.Popup
    popupParameters: null,
    
    constructor: function(params) {
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        dojo.mixin(this, params);
        
        this.initIdentifyTask();
        
        this.popup = new esri.dijit.Popup(this.popupParameters, dojo.create('div'));
        this.popup.resize(400, 300);
        
        this.wireEvents();
    },
    initIdentifyTask: function(params){
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.iParams = new esri.tasks.IdentifyParameters();
        this.iParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;
        this.iParams.returnGeometry = true;
        this.iParams.tolerance = 5;
        
        this.iTask = new esri.tasks.IdentifyTask(this.url);
    },
    wireEvents: function(){
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        dojo.connect(this.iTask, "onError", this, 'onTaskError');
        dojo.connect(this.iTask, "onComplete", this, 'onTaskComplete');
        dojo.connect(this.popup, "onSelectionChange", this, 'onPopupSelectionChange');
    },
    onPopupSelectionChange: function(){
        // summary:
        //      When the user clicks through the different features in the popup
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        var selectedFeature = this.popup.getSelectedFeature();
        
        if (selectedFeature){
            var current = this.popup.selectedIndex + 1;
            var numberTxt = '(' + current + ' of ' + this.popup.features.length + ') ';
            this.popup.setTitle(numberTxt + selectedFeature.getTitle());
        }
    },
    setMap: function(map){
        // summary:
        //      get reference to map and wire onclick event
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.map = map;
        
        dojo.connect(map, "onClick", this, 'onMapClick');
    },
    onTaskError: function(er){
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.errorLogger.log(er, 'error with identify task');
        alert('There was an error with the identify operation. An email has been sent to support staff.');
        
        this.map.hideLoader();
    },
    onTaskComplete: function(iResults){
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        if (iResults.length === 0) {
            this.popup.hide();
            this.map.hideLoader();
            return;
        }
        
        this.popup.clearFeatures();
        this.popup.setFeatures(dojo.map(iResults, function(result){
            var g = result.feature;
            delete g.attributes.OBJECTID;
            delete g.attributes.Shape;
            delete g.attributes.Shape_Length;
            delete g.attributes.Shape_Area;
            g.setInfoTemplate(this.getInfoTemplate(result));
            return g;
        }, this));
        this.onPopupSelectionChange();
        this.popup.show(this.iParams.geometry);
        
        this.map.hideLoader();
    },
    getInfoTemplate: function(result){
        // summary:
        //      builds an info template based upon the display field of the graphic
        // result: esri.tasks.IdentifyResult
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        var titleString = result.layerName + ': ${' + result.displayFieldName + '}';
        return new esri.InfoTemplate(titleString, '${*}');
    },
    onMapClick: function(evt){
        // summary:
        //      description
        // map: esri.Map
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.map.showLoader();
        
        this.iParams.geometry = evt.mapPoint;
        this.iParams.height = this.map.height;
        this.iParams.width = this.map.width;
        this.iParams.mapExtent = this.map.extent;
        
        this.iParams.maxAllowableOffset = (this.map.extent.getWidth() / this.map.width);
                
        this.iTask.execute(this.iParams);
    },
    identifyGraphic: function(graphic, layerName, displayFieldName){
        // summary:
        //      displays the popup in the centroid of the graphic
        // layerName: String
        // displayFieldName: String
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        // set point that the popup will be placed on the map
        var pnt;
        switch(graphic.geometry.type){
            case 'point':
                pnt = graphic.geometry;
                break;
            case 'polyline':
                var ind = graphic.geometry.paths[0].length / 2;
                pnt = graphic.geometry.getPoint(0, ind);
                break;
            case 'polygon':
                pnt = graphic.geometry.getExtent().getCenter();
                break;
        }
        this.iParams.geometry = pnt;
        
        // fake an identify result object list to popup identify dialog
        this.onTaskComplete([{
            feature: graphic,
            layerName: layerName,
            displayFieldName: displayFieldName}]);
    }
});

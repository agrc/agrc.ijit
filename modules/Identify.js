define([
    'dojo/_base/declare',
    'esri/dijit/Popup',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'esri/tasks/IdentifyTask',
    'esri/tasks/IdentifyParameters',
    'dojo/aspect',
    'dojo/_base/array',
    'esri/InfoTemplate'

], function(
    declare,
    Popup,
    lang,
    domConstruct,
    IdentifyTask,
    IdentifyParameters,
    aspect,
    array,
    InfoTemplate
) {
    return declare("ijit/modules/Identify", null, {
        // summary:
        //      quick and dirty identify for all layers in map service
        // 
        // example:
        // |    this.popup = new Popup({url: AGRC.urls.enviroMapService});
        // |    this.map = new BaseMap(this.mapDiv, {
        // |        useDefaultBaseMap: false,
        // |        showAttribution: false,
        // |        infoWindow: this.popup.popup
        // |    });
        // |    this.popup.setMap(this.map);

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

            lang.mixin(this, params);

            this.initIdentifyTask();

            this.popup = new Popup(this.popupParameters, domConstruct.create('div'));
            this.popup.resize(400, 300);

            this.wireEvents();
        },
        initIdentifyTask: function() {
            // summary:
            //      description
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            this.iParams = new IdentifyParameters();
            this.iParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            this.iParams.returnGeometry = true;
            this.iParams.tolerance = 5;

            this.iTask = new IdentifyTask(this.url);
        },
        wireEvents: function() {
            // summary:
            //      description
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            aspect.after(this.iTask, "onError", lang.hitch(this, this.onTaskError), true);
            aspect.after(this.iTask, "onComplete", lang.hitch(this, this.onTaskComplete), true);
            aspect.after(this.popup, "onSelectionChange", lang.hitch(this, this.onPopupSelectionChange), true);
        },
        onPopupSelectionChange: function() {
            // summary:
            //      When the user clicks through the different features in the popup
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            var selectedFeature = this.popup.getSelectedFeature();

            if (selectedFeature) {
                var current = this.popup.selectedIndex + 1;
                var numberTxt = '(' + current + ' of ' + this.popup.features.length + ') ';
                this.popup.setTitle(numberTxt + selectedFeature.getTitle());
            }
        },
        setMap: function(map) {
            // summary:
            //      get reference to map and wire onclick event
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            this.map = map;

            aspect.after(map, "onClick", lang.hitch(this, this.onMapClick), true);
        },
        onTaskError: function(er) {
            // summary:
            //      description
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            this.errorLogger.log(er, 'error with identify task');
            window.alert('There was an error with the identify operation. An email has been sent to support staff.');

            this.map.hideLoader();
        },
        onTaskComplete: function(iResults) {
            // summary:
            //      description
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            if (iResults.length === 0) {
                this.popup.hide();
                this.map.hideLoader();
                return;
            }

            this.popup.clearFeatures();
            this.popup.setFeatures(array.map(iResults, function(result) {
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
        getInfoTemplate: function(result) {
            // summary:
            //      builds an info template based upon the display field of the graphic
            // result: esri.tasks.IdentifyResult
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            var titleString = result.layerName + ': ${' + result.displayFieldName + '}';
            return new InfoTemplate(titleString, '${*}');
        },
        onMapClick: function(evt) {
            // summary:
            //      description
            // map: esri.Map
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            this.identifyPoint(evt.mapPoint);
        },
        identifyPoint: function(mapPoint) {
            // summary:
            //      fires the identify task on the specific point
            // mapPoint: Point
            console.log(this.declaredClass + "::identifyPoint", arguments);

            this.map.showLoader();

            this.iParams.geometry = mapPoint;
            this.iParams.height = this.map.height;
            this.iParams.width = this.map.width;
            this.iParams.mapExtent = this.map.extent;

            this.iParams.maxAllowableOffset = (this.map.extent.getWidth() / this.map.width);

            this.iTask.execute(this.iParams);
        },
        identifyGraphic: function(graphic, layerName, displayFieldName) {
            // summary:
            //      displays the popup in the centroid of the graphic
            // layerName: String
            // displayFieldName: String
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            // set point that the popup will be placed on the map
            var pnt;
            switch (graphic.geometry.type) {
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
                displayFieldName: displayFieldName
            }]);
        }
    });
});
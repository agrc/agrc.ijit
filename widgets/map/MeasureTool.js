dojo.provide('ijit.widgets.map.MeasureTool');

dojo.require('dojo.io.script');
dojo.require('dijit.form.Button');
dojo.require('dojox.layout.FloatingPane');
dojo.require('dijit.form.ComboBox');

dojo.declare('ijit.widgets.map.MeasureTool', [dijit._Widget, dijit._Templated], {
    // summary:
    // example:

    //must be true if you have dijits in your template string
    widgetsInTemplate: true,

    drawingToolbar: null,

    map: null,

    //maybe use this at some point to leave the line drawn on the map?
    symbol: null,

    //unitOfMeasureNode: dojoattachpoint

    unitOfMeasure: "Feet",

    //the last measure result
    currentLength: null,

    measureResult: "",

    attributeMap:
        dojo.delegate(dijit._Widget.prototype.attributeMap, {
            measureResult: {
                node: "resultContainer",
                type: "innerHTML"
            }
        }),

    //location of widget template
    templateString: dojo.cache("ijit.widgets.map.templates", "MeasureToolTemplate.htm"),

    //Your constructor method will be called before the parameters are mixed into the widget,
    //and can be used to initialize arrays, etc.
    constructor: function (params) {
        console.log(this.declaredClass + "::" + arguments.callee.nom);
    },

    //This is typically the workhorse of a custom widget.
    //The widget has been rendered (but note that sub-widgets in the containerNode have not!).
    //The widget though may not be attached to the DOM yet so you shouldn't do
    //any sizing calculations in this method.
    postCreate: function () {
        console.log(this.declaredClass + "::" + arguments.callee.nom);
        this.inherited(arguments);

        this.subscribe("ijit.widgets.map.MeasureTool.Measure", this.show);

        if (!this.map) {
            throw new Error("no map.");
        }

        if (!this.drawingToolbar) {
            this.drawingToolbar = new esri.toolbars.Draw(this.map);
        }

        this.connect(this.drawingToolbar, "onDrawEnd", dojo.hitch(this, "measureLine"));
    },

    //TODO: description
    show: function () {
        console.log(this.declaredClass + "::" + arguments.callee.nom);

        if (!dojo.hasClass(this.container, "widgetHidden")) {
            this.drawingToolbar.deactivate();
            dojo.addClass(this.container, 'widgetHidden');
        }
        else {
            dojo.removeClass(this.container, "widgetHidden");
        }
    },

    //TODO: description
    activateMeasure: function () {
        console.log(this.declaredClass + "::" + arguments.callee.nom);

        this.drawingToolbar.activate(esri.toolbars.Draw.LINE);
    },

    //TODO: description
    measureLine: function (path) {
        console.log(this.declaredClass + "::" + arguments.callee.nom);
        var modifiedContent = { "f": "json", "sr": 26912, "polylines": dojo.toJson([path]) };

        dojo.io.script.get({
            url: "http://mapserv.utah.gov/ArcGIS/rest/services/Geometry/GeometryServer/lengths",
            content: modifiedContent,
            callbackParamName: 'callback'
        }).then(dojo.hitch(this, this.onMeasureComplete), dojo.hitch(this, this.onMeasureError));
    },

    //TODO: description
    changeUnit: function (value) {
        console.log(this.declaredClass + "::" + arguments.callee.nom);
        var result = 0;

        if (this.currentLength) {
            if (this.unitOfMeasure === "Feet") {
                this.currentLength = this._convertFeetToMeters(this.currentLength);
                result = this.currentLength.toString() + " m";
            }
            else if (this.unitOfMeasure === "Meters") {
                this.currentLength = this._convertMetersToFeet(this.currentLength);
                result = this.currentLength.toString() + " ft";
            }
        }

        this.unitOfMeasure = value;
        this.set('measureResult', result);
    },

    onMeasureComplete: function (response) {
        console.log(this.declaredClass + "::" + arguments.callee.nom);
        var result = 0;

        if (response.error && response.error.code === 400) {
            this.onMeasureError(response.error.details[0]);
            return;
        }

        meters = response.lengths[0] || 0;
        if (this.unitOfMeasure === "Feet") {
            this.currentLength = this._convertMetersToFeet(meters);
            result = this.currentLength.toString() + " f";
        }
        else if (this.unitOfMeasure === "Meters") {
            this.currentLength = this._roundNumberTwoDigits(meters);
            result = this.currentLength.toString() + " m";
        }

        dojo.publish("ijit.widgets.map.MeasureTool.OnSuccess", [result]);
        this.set('measureResult', result);
    },

    _convertFeetToMeters: function (feet) {
        console.log(this.declaredClass + "::" + arguments.callee.nom);
        var meterInFeet = 0.3048;

        return this._roundNumberTwoDigits(meterInFeet * feet);
    },

    _convertMetersToFeet: function (meters) {
        console.log(this.declaredClass + "::" + arguments.callee.nom);
        var feetInMeter = 3.2808399

        return this._roundNumberTwoDigits(feetInMeter * meters);
    },

    _roundNumberTwoDigits: function (number) {
        console.log(this.declaredClass + "::" + arguments.callee.nom);

        var result = (Math.round(number * 100) / 100);

        return result;
    },

    onMeasureError: function (err) {
        console.log(this.declaredClass + "::" + arguments.callee.nom);
        dojo.publish("ijit.widgets.map.MeasureTool.error", [err]);
    }
});
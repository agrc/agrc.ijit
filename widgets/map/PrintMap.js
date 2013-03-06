dojo.provide('ijit.widgets.map.PrintMap');

dojo.require('dijit._Widget');
dojo.require('dojo.cache');
dojo.require('dojo.io.iframe');
dojo.require('UDAF.widgets._LayersMixin');
dojo.require('UDAF.widgets._LayerLoadingMixin');
dojo.require('UDAF.widgets._TocMixin');
dojo.require('UDAF.widgets._NavigationMixin');
dojo.require('UDAF.widgets._ResizeMixin');

dojo.declare('ijit.widgets.map.PrintMap', [esri.Map, UDAF.widgets._LayersMixin, UDAF.widgets._LayerLoadingMixin, UDAF.widgets._TocMixin, UDAF.widgets._NavigationMixin, UDAF.widgets._ResizeMixin], {
	// description:
	//		**Summary**:
	//		<p>
	//		**Owner(s)**: Scott Davis/Steve Gourley
	//		</p>
	//		<p>
	//		**Test Page**: <a href='/tests/' target='_blank'>'ijit.map.PrintMap.Test</a>
	//		</p>
	//		<p>
	//		**Description**:
	//		
	//		</p>
	//		<p>
	//		**Published Channels/Events**:
	//		</p>
	//		<ul><li>None</li></ul>
	//		<p>
	//			**Exceptions**:
	//		</p>
	//		<ul><li>ijit.widgets.map.PrintMap.PrintComplete with the response object</li></ul>
	//		<p>
	//		**Required Files**:
	//		</p>
	//		<ul><li>None</li></ul>
	// example:
	// |	

	// printUrl: String
	//      The url endpoint for the server object extension, template and method eg: http://blah/mapServer/exts/SOE/template/0/Export
	printUrl: '',

	// textElements: String[]
	//      container for building text element list
	textElements: null,

	constructor: function (args) {
		// summary:
		//		Constructor function for object. 
		// args: Object?
		//		The parameters that you want to pass into the object. Includes: map, printUrl
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.textElements = [];

		this.setupConnections();

		esri.config.defaults.io.proxyUrl = dojo.global.page.proxy;
	},

	_getMapExtent: function () {
		// summary:
		//      gets the bounding box of the map 
		// description:
		//      makes a call to the map to get the extent
		// tags:
		//      private
		// returns:
		//      string representing esri.Extent xmin,ymin,xmax,ymax
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		var extent = this.extent;

		return extent.xmin + ',' + extent.ymin + ',' + extent.xmax + ',' + extent.ymax;
	},

	_validate: function () {
		// summary:
		//      validates the widget for printing
		// description:
		//      checks that the map and print url are not null
		// tags:
		//      private
		// returns:
		//      Boolean
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		if (!this.printUrl) {
			return false;
		}
	},

	_getPrintResources: function () {
		// summary:
		//      gets the map data for printing
		// description:
		//      serializes the esri.layers 
		// tags:
		//      private
		// returns:
		//      Object
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		var content = { resources: [], graphics: [] };

		content.resources = dojo.toJson(this._getLayerResources());
		content.graphics = dojo.toJson(this._getGraphicResources("GraphicsLayer"));

		return content;
	},

	_getLayerResources: function () {
		// summary:
		//      gets the layers
		// description:
		//      serializes the layers for printing on the server
		// tags:
		//      private
		// returns:
		//      json { name: id, type: type, restUrl: layer.url, opacity: layer.opacity }
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		var resources = [];

		dojo.forEach(this.layerIds, function (resource) {
			var layer = this.getLayer(resource);

			if (layer.visible) {

				var resource = {
					name: resource,
					type: layer.declaredClass === 'esri.layers.ArcGISDynamicMapServiceLayer' ? 'ArcGISDynamicMapService' : 'ArcGISTiledMapService',
					restUrl: layer.url,
					opacity: layer.opacity
				};

				if (resource.type === 'ArcGISDynamicMapService') {
					resource.layers = [];
					resource.token = null;

					var currentlyVisible = layer.visibleLayers;
					dojo.forEach(layer.layerInfos, function (info) {
						resource.layers.push({
							id: info.id,
							visible: dojo.indexOf(currentlyVisible, info.id) > -1 ? true : false,
							displayInTOC: dojo.indexOf(currentlyVisible, info.id) > -1 ? true : false,
							definitionQueries: dojo.global.features.layerDefinitions[info.id] || ""
						});
					}, this);
				}

				resources.push(resource);
			}
		}, this);

		return resources;
	},

	_getGraphicResources: function () {
		// summary:
		//      gets the graphics
		// description:
		//      serializes the graphics and their symbology for rebuilding on the server
		// tags:
		//      private
		// returns:
		//       Object
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		var data = [];
		dojo.forEach(this.graphics, function (g) {
			var dShape = g.getDojoShape();

			if (dShape) {
				var gdata = {
					style: {
						lineWidth: dShape.strokeStyle.width,
						lineOpacity: fLayer.opacity,
						lineColor: dShape.strokeStyle.color.toHex(),
						fillOpacity: fLayer.opacity,
						fillColor: dShape.fillStyle.toHex()
					},
					geometry: {
						rings: g.geometry.rings
					}
				};
				data.push(gdata);
			}
		}, this);

		return data;
	},

	buildTextElementArray: function (name, value) {
		// summary:
		//      builds the array
		// description:
		//      soe wants an array of array's
		// tags:
		//      public
		// returns:
		//      Array[]
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.textElements.push([name, value]);
	},

	print: function () {
		// summary:
		//      requests the print map
		// description:
		//      builds the content and sends the request
		// tags:
		//      public
		// returns:
		//      Array[]
		console.log(this.declaredClass + '::' + arguments.callee.nom);

		var content = {
			f: 'json',
			bbox: this._getMapExtent(),
			bboxSR: dojo.toJson(this._getSpatialReference()),
			textElements: dojo.toJson(this.textElements),
			iframe: false
		};

		var layerResources = this._getPrintResources();

		dojo.mixin(content, layerResources);

		var printArgs = {
			url: this.printUrl,
			content: content,
			handleAs: "json",
			timeout: null,
			error: function (err) {
				console.error(err);
				dijit.byId('Print').cancel();
			},
			load: dojo.hitch(this, function (data, ioArgs, widgetRef) {
				if (data["ERROR"] || data["error"] || data["Status"] === 500) {
					console.error(data);
					dijit.byId('Print').cancel();
				} else {
					this._onUploadComplete(data);
					dijit.byId('Print').cancel();
				}
			})
		};

		esri.request(printArgs, { usePost: true, useProxy: true });

		dojo.attr('resultContainer', { href: "#", innerHTML: '' });
	},

	_onUploadComplete: function (response) {
		// summary: 
		//      Success callback for the print method
		// description:
		//      display url
		// tags:
		//      public       
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		dojo.attr('resultContainer', { href: response.url, innerHTML: 'Right click to save' });

		dojo.publish("ijit.widgets.map.PrintMap.PrintComplete", [response]);
	},

	_getSpatialReference: function () {
		// summary:
		//      gets the spatial reference
		// description:
		//      formats the spatial reference from the map how the soe wants it
		// tags:
		//      private
		// returns:
		//      string
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		return { 'wkid': this.spatialReference.wkid };
	},

	setupSubscriptions: function () {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.inherited(arguments);
	}
});
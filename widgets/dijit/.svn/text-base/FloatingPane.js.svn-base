dojo.require('dojox.layout.FloatingPane');
dojo.require('dojo.fx');

dojo.provide('ijit.widgets.dijit.FloatingPane');

dojo.declare('ijit.widgets.dijit.FloatingPane', dojox.layout.FloatingPane, {
	constuctor: function() {
		console.log(this.declaredClass + "::" + arguments.callee.nom);
	},

	close: function() {
		console.log(this.declaredClass + "::" + arguments.callee.nom);
		this.hide();
		//this.onHide();

		dojo.publish('FloatingPane.Hide');
	},

	postCreate: function() {
		// summary:
		//      use this to fix auto height
		// description:
		//      yes
		// tags:
		//      public
		// returns:
		//       
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.inherited(arguments);

		this.subscribe("window.resized", this.resizeToFitContent);
	},

	minimize: function() {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.inherited(arguments);
		setTimeout("dijit.byId('masterBc').layout();", 1000);
		setTimeout("dojo.publish('window.resized', [true]);", 1100);
	},

	show: function(/* Function? */callback) {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.inherited(arguments);
		dijit.byId('masterBc').layout();
		dojo.publish("window.resized", [true]);

		//	this.resize(dojo.coords(this.domNode));
		map.floater.resizeToFitContent();
	},

	resizeToFitContent: function() {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		dojo.global.map.resize();
		//called twice to remove scrollbar and then to resize the map without scrollbar.
		dojo.global.map.resize();
		dojo.global.map.reposition();

		dojo.style(this.canvas, 'height', 'auto');
		dojo.style(this.domNode, 'height', 'auto');
	},

	destroyRecursive: function() {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.show();

		if(this._resizeHandle) {
			this._resizeHandle.destroy();
		}

		this.inherited(arguments);
	}
});
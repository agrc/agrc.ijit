// provide namespace
dojo.provide("ijit.widgets.mobile.ValueSelector");

// dojo widget requires
dojo.require("dijit._WidgetBase");
dojo.require("dojox.mobile.ScrollableView");
dojo.require("dojox.mobile.TextBox");
dojo.require("dojox.mobile.Button");
dojo.require("dojo.cache");

dojo.declare("ijit.widgets.mobile.ValueSelector", [dijit._WidgetBase], {
    // description:
    //      **Summary**: TODO
    //      <p>
    //      **Owner(s)**: TODO
    //      </p>
    //      <p>
    //      **Test Page**: <a href="/tests/dojo/agrc/1.0/agrc/widgets/tests/ValueSelectorTests.html" target="_blank">
    //        agrc.widgets.map.ValueSelector.Test</a>
    //      </p>
    //      <p>
    //      **Description**:
    //      TODO
    //      </p>
    //      <p>
    //      **Published Topics**:
    //      </p>
    //      <ul><li>agrc.widgets.map.TODO.onChangeTheme_ + this.id[Current Theme Info]</li></ul>
    //      <p>
    //      **Exceptions**:
    //      </p>
    //      <ul><li>agrc.widgets.map.TODO NullReferenceException: map.  Pass the map in the constructor.</li></ul>
    //      <p>
    //      **Required Files**:
    //      </p>
    //      <ul><li>agrc/themes/standard/map/ValueSelector.css</li></ul>
    // example:
    // |    var options = {
    // |      "useDefaultExtent": true,
    // |      "useDefaultBaseMap": false
    // |    };
    // |
    // |    var map = new agrc.widgets.map.BaseMap("basemap-div", options);
    // |    var selector = new agrc.widgets.map.BaseMapSelector({ map: map, id: "tundra", position: "BL" });
    
    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    // widgetsInTemplate: true,
    
    // templatePath: [private] String
    //      Path to template. See dijit._Templated
    // templatePath: dojo.moduleUrl("ijit.widgets.mobile", "templates/ValueSelector.html"),

	// view: dojox.mobile.ScrollableView
    //		The new view that is created by the widget that holds all of the values
    view: null,
    
    // item: dojox.mobile.ListItem
    //		The item that holds the selected value
    item: null,
    
    // header: dojox.mobile.Heading
    //		The heading for the values view
    header: null,
    
    
    // Parameters to constructor
    
    // label: String
    //		The label on the left side of the list item
    label: "",
    
    // options: [<label>String, <value>String]
    //		The list of options that can be selected
    options: null,
    
    // allowNew: Boolean
    //		Determines whether there is a text box below the list of values 
    //		that allows the user to type in a new value. Defaults to true.
    allowNew: true,
    
    constructor: function(params, div) {
        // summary:
        //    Constructor method
        // params: Object
        //    Parameters to pass into the widget. Required values include: label, options.
        //		Optional: allowNew
        // div: String|DomNode
        //    A reference to the div that you want the widget to be created in.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    },
    postCreate: function() {
        // summary:
        //    Overrides method of same name in dijit._Widget.
        // tags:
        //    private
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    	
    	this._createScrollableView();
    	
    	this._createValuesList();
    	
    	this._createListItem();
    },
    _createScrollableView: function(){
    	// summary:
    	//		Creates a new view and adds it to the page
    	console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    	
    	this.view = new dojox.mobile.ScrollableView({
    		id: this.id + "_view",
    		style: {
    			display: "none"
    		}
    	}).placeAt(dojo.body());
    	
    	this.header = new dojox.mobile.Heading({
    		back: "Back",
    		moveTo: dijit.getEnclosingWidget(this.domNode.parentNode).id,
    		fixed: "top",
    		label: this.label
    	}).placeAt(this.view.domNode);
    	this.header.startup();
    	
    	var cat = new dojox.mobile.RoundRectCategory({
    		label: "Please select a species:"
    	}).placeAt(this.view.domNode);
    	cat.startup();
    },
    _createValuesList: function(){
    	// summary:
    	//		creates the list of possible values within the view
    	console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    	
    	var that = this;
    	var lst = new dojox.mobile.RoundRectList({
    		onCheckStateChanged: function(item){
    			that.item.set("rightText", item.value);
    		},
    		select: "single"
    	}).placeAt(this.view.domNode);
    	lst.startup();
    	
    	dojo.forEach(this.options, function(opt){
    		var item = new dojox.mobile.ListItem({
    			moveTo: dijit.getEnclosingWidget(this.domNode.parentNode).id,
    			transition: "slide",
    			transitionDir: "-1",
    			label: opt[0],
    			value: opt[1]
    		}).placeAt(lst.domNode);
    		item.startup();
    	}, this);
    	
    	if (this.allowNew){
    		var cat = new dojox.mobile.RoundRectCategory({
	    		label: "Or type in a new " + this.label
	    	}).placeAt(this.view.domNode);
	    	cat.startup();
	    	
	    	var rr = new dojox.mobile.RoundRect().placeAt(this.view.domNode);
	    	rr.startup();
	    	var tbl = dojo.create("table", {style:"width: 100%"}, rr.domNode);
	    	var row = dojo.create("tr", null, tbl);
	    	var cell = dojo.create("td", null, row);
	    	var txtbx = new dojox.mobile.TextBox({
	    		selectOnClick: true,
	    		placeHolder: "New " + this.label + "...",
	    		style: "width: 90%",
	    		onInput: function(evt){
	    			// TODO: set to disabled when there is not value.
    				btn.set("disabled", false);
	    		}
	    	}).placeAt(cell);
	    	txtbx.startup();
	    	var cell2 = dojo.create("td", {align: "right"}, row);
	    	var btn = new dojox.mobile.Button({
	    		disabled: true,
	    		label: "Done",
	    		onClick: function(){
	    			that.item.set("rightText", txtbx.get("value"));
	    			that.header.goTo(dijit.getEnclosingWidget(that.domNode.parentNode).id);
	    		}
	    	}).placeAt(cell2);
	    	btn.startup();
    	}
    },
    _createListItem: function(){
    	// summary:
    	//		Creates the list item with the appropriate label and move to attribute
    	console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    	
    	var that = this;
    	var lst = new dojox.mobile.RoundRectList(null).placeAt(this.domNode);
    	lst.startup();
    	
    	this.item = new dojox.mobile.ListItem({
    		label: this.label,
    		clickable: true,
    		rightText: "tap to select",
    		id: this.id + "_listItem",
    		moveTo: this.id + "_view"
    	}).placeAt(lst.domNode);
    	this.item.startup();
    },
    destroyRecursive: function(){
    	// summary:
    	//		make sure that the view is destroyed
    	console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    	
    	this.inherited(arguments);
    	
    	dojo.destroy(this.view.domNode);
    }
});
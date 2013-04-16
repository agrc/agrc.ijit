describe("Value Selector", function(){
	var testDiv, testWidget;
	
	beforeEach(function(){
		testDiv = dojo.create("div", null, "home");
		
		testWidget = new ijit.widgets.mobile.ValueSelector({
			label: "Species",
			options: [
				["option1", "value1"],
				["option2", "value2"],
				["option3", "value3"]
			]
		}, testDiv);
	});
	
	afterEach(function(){
		testWidget.destroyRecursive();
		testWidget = null;
		dojo.destroy(testDiv);
	});
	
	it('should create a valid instance of dijit._Widget', function(){
		expect(testWidget instanceof dijit._WidgetBase).toBeTruthy();
	});
	
	it('should create a list item', function(){
		expect(testWidget.get("label")).toEqual("Species");
		expect(dijit.byId(testWidget.id + "_listItem")).toBeTruthy();
		expect(dijit.byId(testWidget.id + "_listItem").label).toEqual("Species");
	});
	
	it('should create a new scrollable view', function(){
		expect(dijit.byId(testWidget.id + "_view")).toBeTruthy();
	});
	
	it("should create the correct number of options in the new view", function(){
		var options = dojo.query(".mblListItem", testWidget.view.domNode);
		expect(options.length).toEqual(3);
	});
});

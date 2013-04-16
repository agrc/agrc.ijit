describe('Layout Widget', function(){
	var widget;
	
	beforeEach(function(){
		widget = dijit.byId('main');
	});
	
	it('should create the correct number of quick links', function(){
		var underTest = dijit.byId('qmenu');
		
		expect(underTest.getChildren().length).toEqual(4);
	});
	
	it('should create a BaseMap widget', function(){
		expect(widget.map instanceof agrc.widgets.map.BaseMap).toBeTruthy();
	});
	
	it('should mixin the appropriate params to the BaseMap that were passed into baseMapParams', function(){
		expect(widget.map.fitExtent).toBeTruthy();
	});
	
	it('should create an img element when logo2 is passed in', function(){
		expect(dojo.query('.logo2').length).toEqual(1);
	});
	
	it('should create extra foot links', function(){
		expect(widget.innerFooter.children.length).toEqual(5);
	});
});

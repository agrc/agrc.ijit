describe('ZoomToCoords', function(){
	var testWidget;
	beforeEach(function(){
		testWidget = dijit.byId('test-div');
	});
	
	it('should create a valid instance of dijit._Widget', function(){
		expect(testWidget instanceof dijit._Widget).toBeTruthy();
	});
});
/*global describe, beforeEach, afterEach, it, expect, spyOn, waits, waitsFor, runs,
 ijit, dojo, jasmine, navigator*/
dojo.require('ijit.modules.ErrorLogger');

describe("ErrorLogger", function() {
	var testObject, params, er;
	beforeEach(function() {
		er = {
			message : 'Error message'
		};
		params = {
			appName : 'Application Name',
			userName : 'Scott Davis'
		};
		testObject = new ijit.modules.ErrorLogger(params);
	});
	afterEach(function() {
		testObject = null;
	});
	describe("constructor", function() {
		it("should return a valid object", function() {
			testObject = new ijit.modules.ErrorLogger(params);

			expect(testObject).toBeDefined();
		});
		it("should accept the following parameters", function() {
			testObject = new ijit.modules.ErrorLogger(params);

			expect(testObject.appName).toEqual(params.appName);
			expect(testObject.userName).toEqual(params.userName);
		});
		it("should require the appName but not the userName", function() {
			expect(function() {
				ijit.modules.ErrorLogger({});
			}).toThrow('appName is required!');
		});
		it("should call initXHR", function() {
			var spy = jasmine.createSpy();
			params.initXHR = spy;
			testObject = new ijit.modules.ErrorLogger(params);

			expect(spy).toHaveBeenCalled();
		});
	});
	describe("initXHR", function() {
		it("should be defined", function() {
			expect( typeof testObject.initXHR).toEqual('function');
		});
		it("should set the load and error properties", function() {
			expect(testObject.xhrArgs.load).toEqual(testObject.xhrLoad);
			expect(testObject.xhrArgs.error).toEqual(testObject.xhrError);
		});
	});
	describe("xhrLoad", function() {
		it("should be a function", function() {
			expect( typeof testObject.xhrLoad).toEqual('function');
		});
	});
	describe("xhrError", function() {
		it("should be a function", function() {
			expect( typeof testObject.xhrError).toEqual('function');
		});
	});
	describe("log", function() {
		beforeEach(function() {
			spyOn(dojo, 'xhrGet');
		});
		it("should be a function", function() {
			expect( typeof testObject.log).toEqual('function');
		});
		it("should require the er parameter", function() {
			expect(function() {
				testObject.log();
			}).toThrow('er is required!');
		});
		it("should call dojo.xhrGet", function() {
			testObject.log(er);

			expect(dojo.xhrGet).toHaveBeenCalled();
		});
		it("should mix in the parameters into the content for the xhrget call", function() {
			testObject.log(er, 'Other Data', true);

			var content = dojo.xhrGet.mostRecentCall.args[0].content;

			expect(content.errorObject).toEqual(er + '||' + er.stack || 'no stack available');
			expect(content.otherData).toEqual('Other Data');
			expect(content.sendEmail).toEqual(true);
		});
		it("should include the other parameters for the get data", function() {
			params.userName = 'stdavis';
			testObject = new ijit.modules.ErrorLogger(params);

			spyOn(testObject, 'getNavigatorData').andReturn(true);

			testObject.log(er, 'Other Data', true);

			var content = dojo.xhrGet.mostRecentCall.args[0].content;
			
			expect(content.appName).toEqual(testObject.appName);
			expect(content.navigatorObject).toEqual(true);
			expect(content.url).toEqual(document.URL);
			expect(content.userName).toEqual(params.userName);
		});
	});
	describe("getNavigatorData", function() {
		it("should return the correct properties of the navigator object", function() {
			var expected = dojo.toJson({
				userAgent : navigator.userAgent,
				platform : navigator.platform
			});

			expect(testObject.getNavigatorData()).toEqual(expected);
		});
	});
});

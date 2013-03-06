dojo.require('dojo.io.iframe');
dojo.require('dojo.cache');
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('dojo.fx');
dojo.require('dijit.form.Button');
dojo.require('dijit.form.TextBox');

dojo.provide('ijit.widgets.upload.FileUpload');

dojo.declare('ijit.widgets.upload.FileUpload', [dijit._Widget, dijit._Templated], {
	// description:
	//		**Summary**: Wrapper around a file upload
	//		<p>
	//		**Owner(s)**: Steve Gourley
	//		</p>
	//		<p>
	//		**Test Page**: <a href='/tests/dojo/agrc/1.0/agrc/widgets/tests/FileUpload2Tests.html' target='_blank'>agrc.widgets.upload.FileUpload2.Test</a>
	//		</p>
	//		<p>
	//		**Description**:
	//		Handles uploading and deleting of files
	//		</p>
	//		<p>
	//		**Published Channels/Events**:
	//		</p>
	//		<ul><li>ijit.widgets.upload.UploadComplete is published on a successful upload and the uploadName is passed back. [this.uploadName]</li><li>ijit.widgets.upload.DeleteComplete is published on a successful delete and the uploadName is passed back. [this.uploadName]</li></ul>
	//		<p>
	//			**Exceptions**:
	//		</p>
	//		<ul><li>None</li></ul>
	//		<p>
	//		**Required Files**:
	//		</p>
	//		<ul><li>None</li></ul>
	// example:
	// |	

	//must be true if you have dijits in your template string
	widgetsInTemplate: true,

	//location of widget template
	templateString: dojo.cache("ijit.widgets.upload.templates", "FileUploadTemplate.htm"),

	// guid: String
	//		String representation of a guid for databinding on teh server
	guid: "",

	// url: String
	//		Url to upload to
	url: "",

	// deleteUrl: String
	//		url to remove file from server
	deleteUrl: "",

	// uploadName: String
	//		The uploaded file name if one exists on the server already
	uploadName: "",

	constructor: function (args) {
		// summary:
		//		Constructor function for object. 
		// args: Object?
		//		The parameters that you want to pass into the object. Includes: 
		console.log(this.declaredClass + "::" + arguments.callee.nom);
	},

	postMixInProperties: function () {
		// summary:
		//		Massage mixed in values
		// description:
		//		
		console.log(this.declaredClass + "::" + arguments.callee.nom);
		this.inherited(arguments);
	},

	postCreate: function () {
		// summary:
		//		Sets up the widget
		// description:
		//		

		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.uploadName ? this.hideUploadButton(false) : this.showUploadButton(false);
	},

	upload: function () {
		// summary: 
		//      Calls the upload on the uploader
		// description:
		//      Calls the upload on the uploader, appends guid and name for the discovery on the server
		// tags:
		//      public       
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		//extend fix 24337
		//console.log('extending iframe');

		var content = { Guid: this.guid,
			name: this.id
		};

		dojo.io.iframe.send({
			url: this.url,
			form: this.form,
			content: content,
			handleAs: "json",
			error: dojo.hitch(this, function (err) {
				this.onError(err);
			}),
			load: dojo.hitch(this, function (data, ioArgs, widgetRef) {
				console.dir(data);
				console.log(data["ERROR"] || data["error"] || data["Status"] === 500);

				if (data["ERROR"] || data["error"] || data["Status"] === 500) {
					this.onError(data);
				} else {
					this.onUploadComplete(data);
				}
			})
		});
	},

	onUploadComplete: function (response) {
		// summary: 
		//      Success callback for the Upload method
		// description:
		//      Calls the upload on the uploader, appends guid and name for the discovery on the server
		// tags:
		//      public       
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.filename.set('value', response.file);
		this.hideUploadButton(true);

		dojo.publish("ijit.widgets.upload.UploadComplete", [this.id]);
	},

	onError: function (response) {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		if (!response.Message) {
			response = { Message: "Something went wrong." };
		}

		this.errorContainer.innerHTML = response.Message;
	},

	deleteUpload: function () {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		//dojo.xhr to delete file
		var deferred = dojo.xhrDelete({
			url: this.deleteUrl,
			handleAs: 'json',
			content: { "guid": this.guid, "name": this.id }
		});

		deferred.addCallbacks(dojo.hitch(this, "onDeleteSuccess"), dojo.hitch(this, "onError"));
	},

	onDeleteSuccess: function (response) {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.showUploadButton(true);
		dojo.publish("ijit.widgets.upload.DeleteComplete", [this.id]);
	},

	hideUploadButton: function (/* Boolean */animate) {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		var u = animate ? {
			aniFunc: dojo.fadeOut,
			ani: true,
			endDisp: "none"
		} : {
			endDisp: "none",
			ani: false
		},
		d = animate ? {
			ani: true,
			aniFunc: dojo.fadeIn,
			endDisp: "block"
		} : {
			endDisp: "block",
			ani: false
		};

		this._hideShowUploadButton(u, d);
	},

	showUploadButton: function (/* Boolean */animate) {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		var u = animate ? {
			aniFunc: dojo.fadeIn,
			ani: true,
			endDisp: "block"
		} : {
			endDisp: "block",
			ani: false
		},
		d = animate ? {
			aniFunc: dojo.fadeOut,
			ani: true,
			endDisp: "none"
		} : {
			endDisp: "none",
			ani: false
		};

		this._hideShowUploadButton(u, d);
	},

	_hideShowUploadButton: function (u, d) {
		console.log(this.declaredClass + "::" + arguments.callee.nom);

		this.errorContainer.innerHTML = "";

		var uploadNode = this.uploadContainer, deleteNode = this.fileContainer;

		var onEnd = function (node, endDisp) {
			dojo.style(node, "display", endDisp);
		}

		if (u.ani) {
			dojo.fx.combine([u.aniFunc({
				node: uploadNode,
				onEnd: dojo.partial(onEnd, uploadNode, u.endDisp)
			}), d.aniFunc({
				node: deleteNode,
				onEnd: dojo.partial(onEnd, deleteNode, d.endDisp)
			})]).play();
		}
		else {
			onEnd(deleteNode, d.endDisp);
			onEnd(uploadNode, u.endDisp);
		}
	}
});
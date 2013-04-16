// provide namespace
dojo.provide('ijit.widgets.layout.PageLayout');

// dojo widget requires
dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

// other dojo requires
dojo.require('dijit.layout.BorderContainer');
dojo.require('dijit.layout.ContentPane');
dojo.require('dijit.form.Button');
dojo.require('dijit.Menu');
dojo.require('agrc.widgets.map.BaseMap');
dojo.require('dijit.Dialog');

dojo.declare('ijit.widgets.layout.PageLayout', [dijit._Widget, dijit._Templated], {
    // description:
	//		**Summary**: A layout template for a mapping application.
	//		<p>
	//		**Owner(s)**: Scott Davis
	//		</p>
	//		<p>
	//		**Test Page**: <a href='/tests/dojo/ijit/widgets/tests/PageLayoutTests.html' target='_blank'>
	//			agrc.widgets.layout.PageLayout.Tests</a>
	//		</p>
	//		<p>
	//		**Description**:
    //		Page template with right sidebar. Anything within the child div (id='right') 
	//		will be placed in the right sidebar. See example below. This widget works better when
	//		'parseOnLoad' is set to false in djconfig. Everything within the widget is already
	//		parsed anyway.
	//		</p>
	//		**Required Files**: ijit/widgets/themes/standard/layout/PageLayout.css 
	//		agrc/widgets/themes/standard/agrc.css
	//		
    // example:
    // |	var params = {
	// |		title: 'SBI Operations Coordination',
	// |		baseMapParams: {defaultBaseMap: 'UtahBasemap-Hybrid'}
	// |	};
	// |	var layout = new ijit.widgets.layout.PageLayout(params, 'main');
	// |
	// |	<div id='main'>
	// |		<div id='right'>
	// |			test1
	// |		</div>
	// |	</div>
    
    // widgetsInTemplate: [private] Boolean
	//		Specific to dijit._Templated.
    widgetsInTemplate: true,
	
	// templatePath: [private] String
	//		Path to template. See dijit._Templated
    templatePath: dojo.moduleUrl("ijit.widgets.layout", "templates/PageLayout.html"),
	
	// _defaultLinks: [name, url][]
	//		An array of names and associated urls that are shown by default.
	_defaultLinks: [
		['Utah GIS Portal', 'http://gis.utah.gov'],
		['AGRC', 'http://gis.utah.gov/AGRC']
	],
	
	// map: agrc.widgets.map.BaseMap
	//		A reference to the BaseMap widget.
	map: null,
	
	// Parameters to constructor
	
	// title: String
	//		The title of the application.
	title: '',
	
	// links: [name, url][]
	//		An array of names and associated urls that are placed in the quick links.
	links: null,
	
	// baseMapParams: Object
	//		Parameters that you would like to pass to the embedded 
	//		agrc.widgets.map.BaseMap object.
	baseMapParams: null,
	
	// logo2: String
	//		A path (relative to your page) to a second logo that will be placed next to the AGRC logo.
	//		If nothing is passed then, no logo will be shown.
	logo2: null,
	
	// footerLinks: linkInfo[]
	//		An array of links to add to the footer
	// |	linkInfo = {
	// |		text: '',
	// |		action: '[url] or showContent',
	// |		content: 'path to html file with content'
	// |	}
	footerLinks: null,
	
    constructor: function(params, div){
        // summary:
		//		Constructor method
		// params: Object
		//		Parameters to pass into the widget. Includes map, title, links, and 
		//		optionally baseMapParams and footerLinks.
		// div: String|DomNode
		//		A reference to the div that you want the widget to be created in.
		console.log(this.declaredClass + '::' + arguments.callee.nom, arguments);
		
		// get reference to sidebar content before it's blown away before post create.
		this.sidebarContent = dojo.byId('right');
    },
	
    postCreate: function(){
		// summary:
		//		Overrides method of same name in dijit._Widget.
		// tags:
		//		private
        console.log(this.declaredClass + '::' + arguments.callee.nom, arguments);
		
		this._buildQuickLinks();
		
		if (this.logo2){
			this._addLogo2();
		}
		
		// put stuff into the sidebar
		this.rightSidebar.set('content', this.sidebarContent);
		
		// this makes sure that the inner border container is the correct height
		// before initializing the map
		this.mainContainer.startup();
		
		this._initMap();
		
		this._wireEvents();
		
		if (this.footerLinks){
			this._addFooterLinks();
		}
    },
	
	_wireEvents: function(){
		// summary:
		//		Wire events.
		// tags:
		//		private
		console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
	},
	
	_buildQuickLinks: function(){
		// summary:
		//		Builds a DropDownButton and associated Menu programmatically
		//		This needs to be done programmatically so that the popup will
		//		be placed in the proper place in the dom. You cannot use markup
		//		to put dijits that use a popup within your widgets.
		// links: [name, url]
		//		An array of names and associated urls.
		// tags:
		//		private
		console.log(this.declaredClass + '::' + arguments.callee.nom, arguments);

		// create new menu
		var menu = new dijit.Menu({
            style: "display: none;",
			id: 'qmenu'
        });
		
		function addLinks(linksArray){
			dojo.forEach(linksArray, function(l){
				var menuItem = new dijit.MenuItem({
		            label: l[0],
		            onClick: function() {
		                window.open(l[1]);
		            }
		        });
		        menu.addChild(menuItem);
			});
		}
		
		addLinks(this._defaultLinks);
		addLinks(this.links);
        
		// create button
        var button = new dijit.form.DropDownButton({
            label: "Quick Links",
            dropDown: menu
		});
        this.quickLinks.appendChild(button.domNode);
	},
	
	_addLogo2: function(){
		// summary:
		//		Adds the logo2 img element
		// tags:
		//		private
		console.log(this.declaredClass + '::' + arguments.callee.nom, arguments);
		
		dojo.create('img', {
			src: this.logo2,
			'class': 'logo2'
		}, this.logo1, 'after');
	},
	
	_initMap: function(){
		// summary:
		//		Sets up the BaseMap widget
		// tags:
		//		private
		console.log(this.declaredClass + '::' + arguments.callee.nom, arguments);
		
		this.map = new agrc.widgets.map.BaseMap('mapDiv', this.baseMapParams);
	},
	
	_addFooterLinks: function(){
		// summary:
		//		Adds additional links to the footer
		// tags:
		//      private
		console.log(this.declaredClass + '::' + arguments.callee.nom, arguments);
		
		dojo.forEach(this.footerLinks, function(link){
			// add pipe seperator
			dojo.create('text', {innerHTML: ' | '}, this.innerFooter);
			
			if (link.action !== 'showContent'){
				dojo.create('a', {
					innerHTML: link.text,
					href: link.action,
					target: '_blank'
				}, this.innerFooter);
			} else {
				var dialog = new dijit.Dialog({
					title: link.text,
					draggable: false,
					href: link.content,
					'class': 'info-dialog'
				});
				dojo.create('span', {
					innerHTML: link.text,
					href: '',
					'class': 'footer-link',
					onclick: function(){
						dialog.show();
					}
				}, this.innerFooter);
			}
		}, this);
	}
});
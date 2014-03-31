define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/fx',
    'dojo/fx',
    'dojo/text!ijit/widgets/layout/templates/SideBarToggler.html',
    'dojo/dom-style',
    'dojo/dom-class'

],

function (
    declare,
    lang,
    on,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    fxCore,
    fx,
    template,
    domStyle,
    domClass
    ) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],
    {
        // description:
        //      Button used to open and close a sidebar in a full screen border container layout
        
        widgetsInTemplate: true,
        templateString: template,
        
        // baseClass: [private] String
        //    The css class that is applied to the base div of the widget markup
        baseClass: "side-bar-toggler",
        
        // open: Boolean
        open: true,
        
        // openWidth: Number
        //      The width of the sidebar when it's open
        openWidth: 0,
        
        // Parameters to constructor
        
        // sidebar: domNode
        sidebar: null,
        
        // mainContainer: dijit.layout.BorderContainer
        mainContainer: null,
        
        // map: agrc.widgets.map.BaseMap
        map: null,
        
        // centerContainer: dijit.layout.ContentPane
        //      The center region of the border container
        centerContainer: null,
        
        constructor: function (params) {
            // summary:
            //    Constructor method
            // params: Object
            //    Parameters to pass into the widget. Required values include:
            // div: String|DomNode
            //    A reference to the div that you want the widget to be created in.
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            this.openWidth = domStyle.get(params.sidebar, 'width');
        },
        postCreate: function () {
            // summary:
            //      description
            console.log(this.declaredClass + "::postCreate", arguments);
        
            on(this.domNode, 'click', lang.hitch(this, this.onClick));
        },
        onClick: function () {
            // summary:
            //      description
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            // adjust sidebar width
            var width = (this.open) ? 0 : this.openWidth;
            var centerWidth = (this.open) ? this.openWidth : -this.openWidth;
            var that = this;
            var sidebarAni = fxCore.animateProperty({
                node: this.sidebar,
                properties: {
                    width: width
                },
                onEnd: function(){
                    if (that.mainContainer) {
                        that.mainContainer.layout();
                    }
                    that.map.resize();
                },
                duration: 200
            });
            var mainAni = fxCore.animateProperty({
                node: this.centerContainer,
                properties: {
                    width: domStyle.get(this.centerContainer, 'width') + centerWidth,
                    left: domStyle.get(this.centerContainer, 'left') - centerWidth
                },
                duration: 200
            });
            fx.combine([sidebarAni, mainAni]).play();
            
            // flip arrow
            domClass.toggle(this.arrowImg, 'closed');
            
            this.open = !this.open;
        }
    });
});

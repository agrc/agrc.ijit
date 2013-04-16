/*global dojo, console, document*/
dojo.provide('ijit.widgets.CursorTip');

dojo.declare('ijit.widgets.CursorTip', null, {
    // summary:
    //      A class that adds a tooltip to the map div with the passed in content
    //      Requires: themes/standard/CursorTip.css

    // domNode: Dom Node
    //      The div in which the content will be placed. Created in constructor.
    domNode: null,

    // tipClass: String
    //      The css class that will be added to the tooltip.
    //      This can be used to style the tooltip box   
    tipClass: 'cursor-tip',

    // connects: dojo.connect handles[]
    //      All of the connect handles. Used to disconnect them in destroy method
    connects: null,


    // parameters to constructor

    // offsetx: Number [optional]
    //      x offset from mouse pointer
    offsetx: 14,

    // offsety: Number [optional]
    //      y offset from mouse pointer
    offsety: 8,

    // content: String | HTML Element
    //      The content that you want in the tooltip
    content: 'tooltip text',

    // showOnlyOnce: Boolean [optional]
    //      If true, then the tooltip is only displayed until the user clicks
    //      on the map
    showOnlyOnce: false,

    // map: esri.Map
    //      description
    map: null,

    constructor: function (params) {
        // summary:
        //        The first function to fire. Sets up this class
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        dojo.mixin(this, params);

        this.domNode = dojo.create('div', {
            style: 'display: none; position: absolute;',
            innerHTML: this.content,
            'class': this.tipClass
            }, 
            this.map.container);

        this.wireEvents();
    },
    wireEvents: function () {
        // summary:
        //      description
        console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.connects = [];
    
        this.connects.push(dojo.connect(this.map, 'onMouseOver', this, this.onMouseEnter));
        this.connects.push(dojo.connect(this.map, 'onMouseMove', this, this.onMouseOver));
        this.connects.push(dojo.connect(this.map, 'onMouseOut', this, this.onMouseLeave));

        if (this.showOnlyOnce) {
            this.connects.push(dojo.connect(this.map, 'onClick', this, this.destroy));
        }
    },
    onMouseEnter: function (evt) {
        // summary:
        //      description
        console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        dojo.style(this.domNode, 'display', 'block');
    },
    onMouseOver: function (evt) {
        // summary:
        //      description
        // console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        dojo.style(this.domNode, 'display', 'none');
        dojo.style(this.domNode, {
            left: evt.screenPoint.x + this.offsetx + 'px',
            top: evt.screenPoint.y + this.offsety + 'px'
        });
        dojo.style(this.domNode, 'display', '');
    },
    onMouseLeave: function (evt) {
        // summary:
        //      description
        console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        dojo.style(this.domNode, 'display', 'none');
    },
    destroy: function () {
        // summary:
        //      destroys the div and disconnects the connects
        console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        dojo.forEach(this.connects, function (con) {
            dojo.disconnect(con);
        });
        dojo.destroy(this.domNode);
    }
});
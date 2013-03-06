/*global dojo, dijit, console*/

// provide namespace
dojo.provide("ijit.widgets.layout.PaneStack");

// dojo widget requires
dojo.require("dijit._Widget");

// other dojo requires
dojo.require("dijit.TitlePane");

dojo.declare("ijit.widgets.layout.PaneStack", dijit._Widget, {
    // description:
    //      **Summary**: A group of TitlePanes stacked on top of each other similar to an AccordionPane.
    //		Only one pane can be opened at a time.
    //      <p>
    //      **Owner(s)**: Scott Davis
    //      </p>
    //      <p>
    //      **Test Page**: <a href="/tests/dojo/agrc/1.0/agrc/widgets/tests/PaneStackTests.html" target="_blank">
    //        agrc.widgets.map.PaneStack.Test</a>
    //      </p>
    //      <p>
    //      **Description**:
    //      Wanted something like the AccordionContainer but that didn't automatically fill 100% of the height
    //		of it's container.
    //      </p>
    //      **Required Files**:
    //      </p>
    //      <ul><li>ijit/themes/standard/layout/PaneStack.css</li></ul>
    // example:
    // |    var pStack = new ijit.widgets.layout.PaneStack(null, "pane-stack");
    
    // panes: dijit.TitlePane[]
    //		An array of all of the panes within the widget
    panes: null,
    
    baseClass: "panestack",
    
    // Parameters to constructor
    
    create: function(params, divId) {
        // summary:
        //    create method
        // params: Object
        //    Parameters to pass into the widget. Required values include:
        // div: String|DomNode
        //    A reference to the div that you want the widget to be created in.
        console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.panes = [];
        var that = this;
        
        dojo.forEach(dojo.byId(divId).childNodes, function(node) {
            if(node.nodeName === "DIV") {
                var df = dojo.doc.createDocumentFragment();
                while(node.firstChild) {
                    df.appendChild(node.firstChild);
                }
                var pane = new dijit.TitlePane({
                    title: node.title,
                    content: df,
                    open: node.attributes.open
                }, node);
                pane.startup();
                pane.watch("open", function(att, oldVal, newVal) {
                    if(newVal) {
                        that._onPaneOpen(this);
                    }
                });
                this.panes.push(pane);
            }
        }, this);


        
        this.inherited(arguments);
    },
    postCreate: function() {
        // summary:
        //    Overrides method of same name in dijit._Widget.
        // tags:
        //    private
        console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
    },
    _onPaneOpen: function(openPane) {
        // summary:
        //		When a pane is opened, close all of the other panes.
        // console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);

        dojo.forEach(this.panes, function(pane) {
            if(pane != openPane && pane.get("open")) {
                //pane.set("open", false);
                pane.toggle();
            }
        });
    }
});
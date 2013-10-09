define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/TitlePane',
    'dojo/_base/array',
    'dojo/dom'

],

function (
    declare,
    _WidgetBase,
    TitlePane,
    array,
    dom
    ) {
    return declare([_WidgetBase], {
        // description:
        //      **Summary**: A group of TitlePanes stacked on top of each other similar to an AccordionPane.
        //      Only one pane can be opened at a time.
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
        //      of it's container.
        //      </p>
        //      **Required Files**:
        //      </p>
        //      <ul><li>ijit/themes/standard/layout/PaneStack.css</li></ul>
        // example:
        // |    var pStack = new ijit.widgets.layout.PaneStack(null, "pane-stack");

        // panes: dijit.TitlePane[]
        //      An array of all of the panes within the widget
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
            array.forEach(dom.byId(divId).children, function(node) {
                if (node.nodeName === "DIV") {
                    var df = document.createDocumentFragment();
                    while (node.firstChild) {
                        df.appendChild(node.firstChild);
                    }
                    var pane = new TitlePane({
                        title: node.title,
                        content: df,
                        open: node.attributes.open
                    }, node);
                    pane.startup();
                    pane.watch("open", function(att, oldVal, newVal) {
                        if (newVal) {
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
        add: function(pane) {
            // summary:
            //    Allows a new pane to be added
            // tags:
            //    public
            console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);

            var that = this;
            this.domNode.appendChild(pane.domNode);
            pane.startup();
            pane.watch("open", function(att, oldVal, newVal) {
                if (newVal) {
                    that._onPaneOpen(this);
                }
            });
            this.panes.push(pane);
        },
        remove: function(pane) {
            this.panes.pop(pane);
            pane.destroyRecursive();
        },
        _onPaneOpen: function(openPane) {
            // summary:
            //      When a pane is opened, close all of the other panes.
            // console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);

            array.forEach(this.panes, function(pane) {
                if (pane != openPane && pane.get("open")) {
                    //pane.set("open", false);
                    pane.toggle();
                }
            });
        }
    });
});
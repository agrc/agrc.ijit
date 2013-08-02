define([
        'dojo/_base/declare',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dojo/text!ijit/widgets/notify/templates/ChangeRequest.html',
        'dojo/_base/lang',
        'dojo/_base/Color',
        'dojo/_base/array',
        'dojo/_base/json',
        'dojo/dom-style',
        'dojo/dom-attr',
        'dojo/dom-class',
        'dojo/on',
        'dojo/query',
        'dojo/string',
        'dojo/aspect',
        'dojo/request',
        'esri/toolbars/draw',
        'esri/symbols/SimpleLineSymbol',
        'esri/graphic'
    ],

    function(
        declare,
        widgetBase,
        templatedMixin,
        template,
        lang,
        Color,
        array,
        dojoJson,
        style,
        domAttr,
        domClass,
        on,
        query,
        dojoString,
        aspect,
        request,
        Draw,
        SimpleLineSymbol,
        Graphic
    ) {
        // description:
        //      **Summary**: Allows a user to markup a map, give a description, and submit the shape and description for review.
        //      <p>
        //      **Owner(s)**: Steve Gourley
        //      </p>
        //      <p>
        //      **Test Page**: widgets/tests/ChangeRequest.html
        //      </p>
        //      <p>
        //      **Description**:
        //      This widget hits the email service. A separate viewer page will show the markup made.
        //      </p>
        //      **Exceptions**:
        //      </p>
        //      <ul><li>none</li></ul>
        //
        // example:
        // |    new ChangeRequest({map: map}, 'div');

        return declare('agrc.ijit.widgets.notify.ChangeRequest', [widgetBase, templatedMixin], {
            templateString: template,
            baseClass: 'change-request',
            map: null,
            title: 'Report Map Issue',
            graphicsLayer: null,
            _graphic: null,
            toolbar: null,
            symbol: null,

            constructor: function() {
                // summary:
                //      first function to fire after page loads
                console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            },

            postMixInProperties: function() {
                // summary:
                //      postMixin properties like symbol and graphics layer
                // description:
                //      decide whether to use default graphics layer and symbol
                // tags:
                //      public
                console.info(this.declaredClass + "::" + arguments.callee.nom);

                // default to use the map's graphics layer if none was passed in
                if (!this.graphicsLayer && !! this.map) {
                    this.graphicsLayer = this.map.graphics;

                    //if maps already loaded just set this first.
                    this.own(
                        on(this.map, 'Load', lang.hitch(this,function() {
                            this.graphicsLayer = this.map.graphics;
                        }))
                    );
                }

                // create symbol if none was provided in options
                if (!this.symbol && !! this.map) {
                    this.symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 1);
                }

                this.toolbar = new Draw(this.map);
                this.toolbar.setLineSymbol(this.symbol);
            },

            postCreate: function() {
                console.info(this.declaredClass + '::' + arguments.callee.nom);

                this.form_redline.onsubmit = function() {
                    return false;
                };

                var scoped = this;
                this.own(
                    on(this.btn_submit, 'click', lang.hitch(this, 'submitRedline')),
                    on(this.btn_redline, 'click', lang.hitch(this, 'onDrawStart')),
                    aspect.after(this.toolbar, "onDrawEnd", lang.hitch(this, 'onDrawEnd'), true),
                    aspect.after(this.toolbar, 'activate', function() {
                        domAttr.set(scoped.btn_redline, 'disabled', true);
                    }),
                    aspect.after(this.toolbar, 'deactivate', function() {
                        domAttr.set(scoped.btn_redline, 'disabled', false);
                    })
                );
            },

            onDrawStart: function() {
                console.info(this.declaredClass + '::' + arguments.callee.nom);

                if (this.map && this._graphic) {
                    this.graphicsLayer.remove(this._graphic);
                }

                this.toolbar.activate(Draw.FREEHAND_POLYLINE);
            },

            onDrawEnd: function(geometry) {
                console.info(this.declaredClass + '::' + arguments.callee.nom);

                this._graphic = new Graphic(geometry, this.symbol);
                this.graphicsLayer.add(this._graphic);

                this.toolbar.deactivate();

                //this.txt_description.focus();
            },

            submitRedline: function() {
                // summary:
                //      submits the change request.
                console.info(this.declaredClass + '::' + arguments.callee.nom);

                if (!this._validate()) {
                    return false;
                }

                if (this.map && this._graphic) {
                    this.graphicsLayer.remove(this._graphic);
                }

                var description = this.txt_description.value;

                if (this.request) {
                    this.request.cancel('duplicate in flight');
                    this.request = null;
                }

                this.btn_submit.innerHTML = "Submitting...";

                this.request = this._invokeWebService({
                    description: description
                }).then(
                    lang.hitch(this, 'completed'), lang.hitch(this, 'error')
                );

                return false;
            },

            _validate: function() {
                // summary:
                //      validates the widget
                // description:
                //      makes sure everything is the way it needs to be
                // tags:
                //      private
                // returns:
                //      bool
                console.info(this.declaredClass + "::" + arguments.callee.nom);

                var that = this;

                // hide error messages
                query('.help-inline.error', this.domNode).style('display', 'none');
                query('.control-group', this.domNode).removeClass('error');

                return array.every([
                        this.txt_description
                    ],
                    function(tb) {
                        return that._isValid(tb);
                    });
            },

            _isValid: function(textBox) {
                // summary:
                //      validates that there are values in the textbox
                // textBox: TextBox Element
                console.log(this.declaredClass + "::_isValid", arguments);

                var valid = dojoString.trim(textBox.value).length > 0;

                if (!valid) {
                    query('span', textBox.parentElement).style('display', 'inline');
                    domClass.add(textBox.parentElement.parentElement, 'error');
                }

                return valid;
            },

            _invokeWebService: function(args) {
                // summary:
                //      calls the web service
                // description:
                //      sends the request to the service
                // tags:
                //      private
                // returns:
                //     Deferred 
                console.info(this.declaredClass + "::" + arguments.callee.nom);

                var url = "http://localhost/sendemailservice/notify";

                var options = {
                    email: {
                        toIds: [3],
                        fromId: 2
                    },
                    template: {
                        templateId: 3,
                        templateValues: {
                            description: args.description,
                            application: window.location.href,
                            basemap: this.map.layerIds[0]
                        }
                    }
                };

                if (this._graphic && this._graphic.geometry) {
                    options.template.templateValues.link = "http://localhost/experimental/GraphicViewer?center={{center}}&level={{level}}&redline={{redline}}";
                    options.template.templateValues.center = this.map.extent.getCenter().toJson();
                    options.template.templateValues.level = this.map.getLevel();
                    options.template.templateValues.redline = this._graphic.geometry.toJson();
                }

                //options.template = dojoJson.toJson(options.template);
                return request.post(url, {
                    data: dojoJson.toJson(options),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            },

            completed: function() {
                console.info(this.declaredClass + '::' + arguments.callee.nom);

                this._graphic = null;
                this.txt_description.value = "";
                this.btn_submit.innerHTML = "Thanks!";
            },

            error: function() {
                // summary:
                //      handles script io error
                // description:
                //      publishes error
                // tags:
                //      private
                // returns:
                //       
                console.info(this.declaredClass + "::" + arguments.callee.nom);

                style.set(this.errorMsg, 'display', 'inline');
                domClass.add(this.errorMsg.parentElement.parentElement, 'error');
                this.btn_submit.innerHTML = "Whoops.";
            }
        });
    });
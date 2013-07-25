define([
        'dojo/_base/declare',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dojo/text!ijit/widgets/notify/templates/ChangeRequest.html',
        'dojo/_base/lang',
        'dojo/_base/Color',
        'dojo/_base/array',
        'dojo/dom-style',
        'dojo/dom-class',
        'dojo/on',
        'dojo/topic',
        'dojo/query',
        'dojo/string',
        'esri/request',
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
        style,
        domClass,
        on,
        topic,
        query,
        dojoString,
        esriRequest,
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
        //      **Test Page**: TODO
        //      </p>
        //      <p>
        //      **Description**:
        //      This widget hits the email service.
        //      </p>
        //      <p>
        //      **Published Topics**: (See the [Dojo Topic System](http://dojotoolkit.org/reference-guide/quickstart/topics.html))
        //      </p>
        //      <ul>
        //          <li>agrc.widgets.locate.FindAddress.OnFindStart[none]</li>
        //          <li>agrc.widgets.locate.FindAddress.OnFind[result]</li>
        //          <li>agrc.widgets.locate.FindAddress.OnFindError[err]</li>
        //      </ul>
        //      **Exceptions**:
        //      </p>
        //      <ul><li>none</li></ul>
        //      <p>
        //      **Required Files**:
        //      </p>
        //      <ul><li>resources/locate/FindAddress.css</li></ul>
        //
        // example:
        // |    new FindAddress({map: map}, 'test1');

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
                    this.connect(this.map, 'onLoad', function() {
                        this.graphicsLayer = this.map.graphics;
                    });
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
                this.form_redline.onsubmit = function() {
                    return false;
                };

                this.own(on(this.btn_submit, 'click', lang.hitch(this, 'submitRedline')),
                         on(this.btn_redline, 'click', lang.hitch(this, '_activateToolbar')),
                         on(this.toolbar, "DrawEnd", lang.hitch(this, '_displayGraphic')));
            },

            _activateToolbar: function() {
                this.toolbar.activate(Draw.LINE);
            },

            _displayGraphic: function(geometry) {
                var graphic = new Graphic(geometry, this.symbol);
                this.graphicsLayer.add(graphic);
                this.toolbar.deactivate();
            },

            submitRedline: function() {
                // summary:
                //      submits the change request.
                console.info(this.declaredClass + '::' + arguments.callee.nom);

                if (!this._validate()) {
                    this.completed();
                    return false;
                }

                this.onSubmit();

                if (this.map && this._graphic) {
                    this.graphicsLayer.remove(this._graphic);
                }

                var description = this.txt_description.value;

                if (this.request) {
                    this.request.cancel('duplicate in flight');
                    this.request = null;
                }

                this.request = this._invokeWebService({
                    description: description,
                    redline: this._graphic
                }).then(
                    lang.hitch(this, '_completed'), lang.hitch(this, '_error')
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
                        toIds: -1,
                        fromId: -1
                    },
                    template: {
                        templateId: -1,
                        templateValues: {
                            graphic: this._graphic
                        }
                    }
                };

                return esriRequest({
                    url: url,
                    content: options,
                    callbackParamName: 'callback'
                });
            },

            completed: function() {

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
            }
        });
    });
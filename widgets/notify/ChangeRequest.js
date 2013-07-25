define([
        'dojo/_base/declare',
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dojo/text!agrc/widgets/notify/templates/ChangeRequest.html',
        'dojo/_base/lang',
        'dojo/on',
        'dojo/_base/Color',
        'dojo/topic',
        'dojo/dom-style',
        'dojo/dom-class',
        'esri/request',
        'esri/toolbars/draw',
        'esri/symbols/SimpleLineSymbol'
    ],

    function(
        declare,
        widgetBase,
        templatedMixin,
        template,
        lang,
        on,
        Color,
        topic,
        style,
        domClass,
        esriRequest,
        Draw,
        SimpleLineSymbol
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
            },

            postCreate: function() {
                this.form_redline.onsubmit = function() {
                    return false;
                };

                on(this.btn_submit, 'click', lang.hitch(this, 'submitRedline'));
            },


            submitRedline: function() {
                // summary:
                //      submits the change request.
                console.info(this.declaredClass + '::' + arguments.callee.nom);

                if (!this._validate()) {
                    this._done();
                    return false;
                }

                this._geocoding();

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
                    lang.hitch(this, '_onFind'), lang.hitch(this, '_onError')
                );

                return false;
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


            done: function() {
                // summary: 
                //      extensibiity point.
            },

            _onError: function(err) {
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

                // re-enable find button
                this.done();

                topic.publish('agrc.widgets.notify.ChangeRequest.OnError', [err]);
            }
        });
    });
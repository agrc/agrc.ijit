define([
    'dojo/text!ijit/widgets/notify/templates/ChangeRequest.html',

    'dojo/_base/declare',
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

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'esri/toolbars/draw',
    'esri/symbols/SimpleLineSymbol',
    'esri/graphic'
], function(
    template,

    declare,
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

    widgetBase,
    templatedMixin,

    Draw,
    SimpleLineSymbol,
    Graphic
) {
    // summary:
    //      Allows a user to markup a map, give a description,
    //      and submit the shape and description for review.
    //      This widget hits the email service.
    //      A separate viewer page will show the markup made.

    return declare([widgetBase, templatedMixin], {
        templateString: template,
        baseClass: 'change-request',
        // a reference to the map
        map: null,
        // the title to display on the widget
        title: 'Report Map Issue',
        // a reference to the graphics layer
        graphicsLayer: null,
        // a reference to the graphic on the map
        _graphic: null,
        // the drawing toolbar
        toolbar: null,
        // the redline symbol
        symbol: null,
        // the base url to the redliner applicatin
        redliner: null,
        // the id's of the emails to notify
        toIds: null,

        constructor: function() {
            // summary:
            //      first function to fire after page loads
            console.info('agrc.ijit.widgets.notify.ChangeRequest::constructor', arguments, arguments);
        },

        postMixInProperties: function() {
            // summary:
            //      postMixin properties like symbol and graphics layer
            // description:
            //      decide whether to use default graphics layer and symbol
            // tags:
            //      public
            console.info('agrc.ijit.widgets.notify.ChangeRequest::postMixInProperties', arguments);

            // default to use the map's graphics layer if none was passed in
            if (!this.graphicsLayer && !!this.map) {
                this.graphicsLayer = this.map.graphics;

                //if maps already loaded just set this first.
                this.own(
                    on(this.map, 'Load', lang.hitch(this, function() {
                        this.graphicsLayer = this.map.graphics;
                    }))
                );
            }

            // create symbol if none was provided in options
            if (!this.symbol && !!this.map) {
                this.symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color([255, 0, 0]), 1);
            }

            this.toolbar = new Draw(this.map);
            this.toolbar.setLineSymbol(this.symbol);
        },

        postCreate: function() {
            console.info('agrc.ijit.widgets.notify.ChangeRequest::postCreate', arguments);

            this.formRedline.onsubmit = function() {
                return false;
            };

            var scoped = this;
            this.own(
                on(this.btnSubmit, 'click', lang.hitch(this, 'submitRedline')),
                on(this.btnRedline, 'click', lang.hitch(this, 'onDrawStart')),
                aspect.after(this.toolbar, 'onDrawEnd', lang.hitch(this, 'onDrawEnd'), true),
                aspect.after(this.toolbar, 'activate', function() {
                    domAttr.set(scoped.btnRedline, 'disabled', true);
                }),
                aspect.after(this.toolbar, 'deactivate', function() {
                    domAttr.set(scoped.btnRedline, 'disabled', false);
                })
            );
        },

        onDrawStart: function() {
            console.info('agrc.ijit.widgets.notify.ChangeRequest::onDrawStart', arguments);

            if (this.map && this._graphic) {
                this.graphicsLayer.remove(this._graphic);
            }

            this.toolbar.activate(Draw.FREEHAND_POLYLINE);
        },

        onDrawEnd: function(geometry) {
            console.info('agrc.ijit.widgets.notify.ChangeRequest::onDrawEnd', arguments);

            this._graphic = new Graphic(geometry, this.symbol);
            this.graphicsLayer.add(this._graphic);

            this.toolbar.deactivate();
        },

        submitRedline: function() {
            // summary:
            //      submits the change request.
            console.info('agrc.ijit.widgets.notify.ChangeRequest::submitRedline', arguments);

            if (!this._validate()) {
                return false;
            }

            if (this.map && this._graphic) {
                this.graphicsLayer.remove(this._graphic);
            }

            var description = this.txtDescription.value;

            if (this.request) {
                this.request.cancel('duplicate in flight');
                this.request = null;
            }

            this.btnSubmit.innerHTML = 'Submitting...';

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
            console.info('agrc.ijit.widgets.notify.ChangeRequest::_validate', arguments);

            var that = this;

            // hide error messages
            query('.help-inline.error', this.domNode).style('display', 'none');
            query('.control-group', this.domNode).removeClass('error');

            return array.every([
                    this.txtDescription
                ],
                function(tb) {
                    return that._isValid(tb);
                });
        },

        _isValid: function(textBox) {
            // summary:
            //      validates that there are values in the textbox
            // textBox: TextBox Element
            console.log('agrc.ijit.widgets.notify.ChangeRequest::_isValid', arguments);

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
            console.info('agrc.ijit.widgets.notify.ChangeRequest::_invokeWebService', arguments);

            var url = '/sendemailservice/notify',
                ids = this.toIds || [2];

            if (ids.length < 1) {
                ids = [2];
            }

            var options = {
                email: {
                    toIds: ids,
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
                options.template.templateValues.link = this.redliner +
                    '?center={{center}}&level={{level}}&redline={{redline}}';
                options.template.templateValues.center = JSON.stringify(this.map.extent.getCenter().toJson());
                options.template.templateValues.level = this.map.getLevel();
                options.template.templateValues.redline = JSON.stringify(this._graphic.geometry.toJson());
            }

            //options.template = dojoJson.toJson(options.template);
            return request.post(url, {
                data: dojoJson.toJson(options),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        completed: function() {
            console.info('agrc.ijit.widgets.notify.ChangeRequest::completed', arguments);

            this._graphic = null;
            this.txtDescription.value = '';
            this.btnSubmit.innerHTML = 'Thanks!';
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
            console.info('agrc.ijit.widgets.notify.ChangeRequest::error', arguments);

            style.set(this.errorMsg, 'display', 'inline');
            domClass.add(this.errorMsg.parentElement.parentElement, 'error');
            this.btnSubmit.innerHTML = 'Whoops.';
        }
    });
});
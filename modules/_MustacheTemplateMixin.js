define([
    'dojo/_base/declare',
    'mustache',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin'

],

function (
    declare,
    mustache,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin
    ) {
    // summary:
    //      Inherit from this class to use mustache as the templating engine for your widget.
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        _skipNodeCache: true,

        _stringRepl: function(tmpl){
            // overriden from _TemplatedMixin

            return mustache.render(tmpl, this);
        }
    });
});
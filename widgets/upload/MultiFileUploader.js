define([
    'dojo/text!./templates/MultiFileUploaderTemplate.html',

    'dojo/_base/declare',
    'dojo/_base/event',

    'dojo/dom-construct',
    'dojo/dom-attr',


    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase'
], function(
    template,

    declare,
    evnt,

    domConstruct,
    domAttr,

    _TemplatedMixin,
    _WidgetBase
) {
    // description:
    //      **Summary**: A widget that creates native file uploaders with the option to add more
    //      <p>
    //      **Owner(s)**: Steve Gourley
    //      </p>
    //      <p>
    //      **Test Page**: <a href='/tests/dojo/agrc/1.0/agrc/widgets/tests/MultiFileUploaderTests.html' target='_blank'>ijit.widgets.MultiFileUploader.Test</a>
    //      </p>
    //      <p>
    //      **Description**: Create multiple input type fileuploaders. Has a plus button to add a new one. Can set the max limit etc. Must already be inside of a form. **Does not create form for you!**
    //      </p>
    //      <p>
    //      **Published Channels/Events**:
    //      </p>
    //      <ul><li>None</li></ul>
    //      <p>
    //          **Exceptions**:
    //      </p>
    //      <ul><li>None</li></ul>
    //      <p>
    //      **Required Files**:
    //      </p>
    //      <ul><li>None</li></ul>
    // example:
    // |    var fu = new MultiFileUploader({max:5}, domNode);
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,

        baseClass: 'multiple-file-uploader',

        // _counter: Number
        //      Keeps track of how many file uploaders you have
        _counter: 1,

        //  max: Number
        //      Max Number of uploaders allowed
        max: 1,

        // postName: String
        //      The name attribute to use on the uploaders so you can use mvc model binding
        // example:
        // |    IEnumerable<HttpPostedFileBase> name
        postName: 'Files',

        // labelText: String
        //      The label text to place at the top of all the uploaders
        labelText: 'Files',

        // moreLabel: String
        //      The label text for the button to add another upload
        moreLabel: 'Add Another File',

        constructor: function() {
            // summary:
            //      Constructor function for object.
            // args: Object?
            //      The parameters that you want to pass into the object. 
            // Includes: max, postName, labelText, moreLabel
            console.log('agrc.ijit.upload.MultiFileUploader::constructor', arguments);
        },

        _add: function(evt) {
            // summary:
            //      A method to add a new file uploader
            console.log('agrc.ijit.upload.MultiFileUploader::_add', arguments);

            evnt.stop(evt);
            
            if (this._isFull()) {
                this.buttonNode.innerHTML = 'Max uploads: ' + this.max;
                domAttr.set(this.buttonNode, 'disabled', true);

                return;
            }

            domConstruct.create('input', {
                'type': 'file',
                name: this.postName,
                'style': {
                    'display': 'block'
                }
            }, this.containerNode);

            this._counter++;

            if (this._isFull()) {
                this.buttonNode.innerHTML = 'Max uploads: ' + this.max;
                domAttr.set(this.buttonNode, 'disabled', true);
            }
        },

        _isFull: function() {
            // summary:
            //      Checkes to see if you can add more uploaders
            // returns: Boolean
            //      true if full false otherwise.
            console.log('agrc.ijit.upload.MultiFileUploader::_isFull', arguments);

            return this._counter === this.max;
        }
    });
});
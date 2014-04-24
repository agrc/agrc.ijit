define([
    'dojo/_base/declare',
    'dojo/dom-class'

], function(
    declare,
    domClass
) {
    return declare(null, {
        // description:
        //      Mixin for displaying error messages.

        showErrMsg: function (msg) {
            // summary:
            //      Displays an error message within the errMsg div
            // msg: String
            console.log('ijit.modules._ErrorMessageMixin::showErrMsg', arguments);
        
            this.errMsg.innerHTML = msg;
            domClass.remove(this.errMsg, 'hidden');
        },

        hideErrMsg: function () {
            // summary:
            //      Hides the errMsg div
            console.log('ijit.modules._ErrorMessageMixin::hideErrMsg', arguments);
        
            this.errMsg.innerHTML = '';
            domClass.add(this.errMsg, 'hidden');
        }
    });
});
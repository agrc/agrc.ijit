/*global profile:true*/
profile = (function () {
    var testResourceRe = /^app\/tests\//;
    var copyOnly = function(filename, mid){
        var list = {
            "ijit/ijit.profile": true,
            "ijit/package.json": true,
            'ijit/modules/JSONLoaderPluginResolver': true
        };
        return (mid in list) ||
            (/^app\/resources\//.test(mid) &&
                !/\.css$/.test(filename)) ||
                /(png|jpg|jpeg|gif|tiff)$/.test(filename);
        // Check if it is one of the special files, if it is in
        // app/resource (but not CSS) or is an image
    };

    return {
        resourceTags: {
            test: function(filename, mid){
                return testResourceRe.test(mid) || mid=="app/tests";
                // Tag our test files
            },
            copyOnly: function(filename, mid){
                return copyOnly(filename, mid);
                // Tag our copy only files
            }
            // amd: function (filename) {
            //     return (/\.js$/).test(filename);
            // }
        }
    };
})();
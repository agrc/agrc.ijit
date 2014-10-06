/*global profile:true*/
profile = (function() {
    var testResourceRe = /.*\/tests\//;
    var copyOnly = function(filename, mid) {
        var list = {
            'ijit/ijit.profile': true,
            'ijit/package.json': true
        };
        return (mid in list) ||
            (/^resources\//.test(mid) && !/\.css$/.test(filename)) ||
            /(png|jpg|jpeg|gif|tiff)$/.test(filename);
        // Check if it is one of the special files, if it is in
        // resource (but not CSS) or is an image
    };
    var ignores = {
        'ijit/Gruntfile': true
    };

    return {
        resourceTags: {
            test: function(filename, mid) {
                return testResourceRe.test(mid) || mid === 'app/tests';
            },
            copyOnly: function(filename, mid) {
                return copyOnly(filename, mid);
            },
            // amd: function (filename) {
            //     return (/\.js$/).test(filename);
            // }
            ignore: function(filename, mid) {
                return mid in ignores || /.*\/node_modules\//.test(mid);
            }
        }
    };
})();
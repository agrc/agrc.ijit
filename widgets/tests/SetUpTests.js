window.dojoConfig = {
    baseUrl: 'bower_components',
    packages: ['dojo', 'dijit', 'dojox', 'esri', 'dgrid', 'put-selector', 'xstyle', {
        name: 'ijit',
        location: '../'
    }, {
        name: 'stubmodule',
        location: 'stubmodule/src',
        main: 'stub-module'
    }, {
        name: 'ladda',
        location: 'ladda-bootstrap',
        main: 'dist/ladda'
    }, {
        name: 'jquery',
        location: 'jquery/dist',
        main: 'jquery'
    }, {
        name: 'bootstrap',
        location: 'bootstrap/dist/js',
        main: 'bootstrap'
    }, {
        name: 'jasmine-fixture',
        location: 'jasmine-fixture/dist',
        main: 'jasmine-fixture'
    }, {
        name: 'mustache',
        location: 'mustache',
        main: 'mustache'
    }],
    has: {
        'dojo-undef-api': true
    },
    map: {
        'ladda': {
            'spin': 'ladda/dist/spin'
        }
    }
};

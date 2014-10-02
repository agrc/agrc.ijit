window.dojoConfig = {
    baseUrl: './',
    packages: [
        {
            name: 'ijit',
            location: '.'
        }, {
            name: 'dojo',
            location: 'bower_components/dojo'
        }, {
            name: 'dijit',
            location: 'bower_components/dijit'
        }, {
            name: 'dojox',
            location: 'bower_components/dojox'
        }, {
            name: 'esri',
            location: 'vendor/esri'
        }, {
            name: 'stubmodule',
            location: 'bower_components/stubmodule/src',
            main: 'stub-module'
        }, {
            name: 'spin',
            location: 'bower_components/spinjs',
            main: 'spin'
        }, {
            name: 'jquery',
            location: 'bower_components/jquery/dist',
            main: 'jquery'
        },{
            name: 'bootstrap',
            location: 'bower_components/bootstrap/dist/js',
            main: 'bootstrap'
        },{
            name: 'dgrid',
            location: 'bower_components/dgrid'
        },{
            name: 'put-selector',
            location: 'bower_components/put-selector'
        },{
            name: 'xstyle',
            location: 'bower_components/xstyle'
        }
    ],
    has: {'dojo-undef-api': true}
};
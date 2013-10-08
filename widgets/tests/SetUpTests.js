window.dojoConfig = {
    packages: [{
        name: 'ijit',
        location: 'http://localhost:8000/'
    },{
        name: 'stubmodule',
        location: 'http://localhost:8000/widgets/tests/stubmodule'
    },{
        name: 'jquery',
        location: 'http://code.jquery.com/',
        main: 'jquery-1.10.2'
    },{
        name: 'bootstrap',
        location: 'http://netdna.bootstrapcdn.com/bootstrap/',
        main: '3.0.0/js/bootstrap'
    }],
    has: {'dojo-undef-api': true}
};
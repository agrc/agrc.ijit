window.dojoConfig = {
    packages: [{
        name: 'ijit',
        location: 'http://localhost:8000/'
    },{
        name: 'stubmodule',
        location: 'http://localhost:8000/widgets/tests/stubmodule'
    }],
    has: {'dojo-undef-api': true}
};
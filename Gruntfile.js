/*global module:false*/
module.exports = function(grunt) {
    var files = [
        // these can be used after all widgets/modules have been upgraded to AMD
        // 'widgets/tests/spec/*.js',
        // 'modules/tests/spec/*.js'
    ];
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            app: {
                src: [
                    'widgets/tests/SetUpTests.js'
                ],
                options: {
                    vendor: [
                        'http://js.arcgis.com/3.7/'
                    ],
                    specs: files
                }
            }
        },
        jshint: {
            files: files,
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: files,
            tasks: ['jasmine:app:build', 'jshint']
        },
        connect: {
            uses_defaults: {}
        }
    });

    // Register tasks.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task.
    grunt.registerTask('default', ['jasmine:app:build', 'jshint', 'connect', 'watch']);
};
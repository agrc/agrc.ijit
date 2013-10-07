/*global module:false*/
module.exports = function(grunt) {
    var specs = [
        'widgets/tests/spec/SpecLoginRegister.js',
        'widgets/tests/spec/Spec_LoginRegisterPaneMixin.js',
        'widgets/tests/spec/Spec_LoginRegisterSignInPane.js',
        'widgets/tests/spec/Spec_LoginRegisterRequestPane.js',
        'widgets/tests/spec/Spec_LoginRegisterForgotPane.js'
    ];
    var jsFiles = specs.concat([
        'widgets/tests/SetUpTests.js',
        'widgets/LoginRegister.js',
        'widgets/_LoginRegisterPaneMixin.js',
        'widgets/_LoginRegisterSignInPane.js',
        'widgets/_LoginRegisterRequestPane.js',
        'widgets/_LoginRegisterForgotPane.js',
        'GruntFile.js'
    ]);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            app: {
                src: [
                ],
                options: {
                    vendor: [
                        'widgets/tests/SetUpTests.js',
                        'http://js.arcgis.com/3.7/'
                    ],
                    specs: specs
                }
            }
        },
        jshint: {
            files: jsFiles,
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: [
                'modules/**/*.js',
                'themes/**/*.js',
                'widgets/**/*.js',
                'modules/**/*.html',
                'themes/**/*.html',
                'widgets/**/*.html',
                'modules/**/*.css',
                'themes/**/*.css',
                'widgets/**/*.css'
            ],
            tasks: ['jasmine:app:build', 'jshint'],
            options: {
                livereload: true
            }
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
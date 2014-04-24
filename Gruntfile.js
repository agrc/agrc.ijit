/* jshint camelcase:false */
module.exports = function(grunt) {
    var specs = [
        'widgets/tests/spec/SpecLoginRegister.js',
        'widgets/tests/spec/Spec_LoginRegisterPaneMixin.js',
        'widgets/tests/spec/Spec_LoginRegisterSignInPane.js',
        'widgets/tests/spec/Spec_LoginRegisterRequestPane.js',
        'widgets/tests/spec/Spec_LoginRegisterForgotPane.js',
        'widgets/tests/spec/Spec_LoginRegisterLogout.js',
        'widgets/tests/spec/Spec_UserAdminUser.js',
        'widgets/tests/spec/SpecUserAdmin.js',
        'modules/tests/spec/SpecNumericInputValidator.js',
        'modules/tests/spec/Spec_ErrorMessageMixin.js'
    ];
    var jsFiles = specs.concat([
        'widgets/tests/SetUpTests.js',
        'widgets/authentication/*.js',
        'modules/NumericInputValidator.js',
        'modules/_ErrorMessageMixin.js',
        'GruntFile.js'
    ]);
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            'default': {
                options: {
                    vendor: [
                        'widgets/tests/SetUpTests.js',
                        'http://js.arcgis.com/3.7/'
                    ],
                    helpers: ['http://code.jquery.com/jquery-1.10.2.js'],
                    specs: specs
                }
            }
        },
        jshint: {
            files: jsFiles,
            options: {
                jshintrc: '.jshintrc',
                ignores: [
                    'resources/libs/*.js',
                    'widgets/tests/stubmodule/**/*.js'
                ]
            }
        },
        watch: {
            files: [
                'modules/**/*.js',
                'widgets/**/*.js',
                'modules/**/*.html',
                'widgets/**/*.html',
                'modules/**/*.css',
                'resources/**/*.css',
                '!**/node_modules/**',
                '!**/stubmodule/**',
                'Gruntfile.js'
            ],
            tasks: ['jasmine:app:build', 'jshint'],
            options: {
                livereload: true
            }
        },
        connect: {
            uses_defaults: {}
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commitFiles: ['-a'],
                push: false
            }
        }
    });

    // Register tasks.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-bump');

    // Default task.
    grunt.registerTask('default', ['jasmine:default:build', 'jshint', 'connect', 'watch']);

    grunt.registerTask('travis', ['jshint', 'connect', 'jasmine:default']);
};
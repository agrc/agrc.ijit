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
            main: {
                options: {
                    vendor: [
                        'widgets/tests/SetUpTests.js',
                        'bower_components/dojo/dojo.js',
                        'bower_components/jquery/dist/jquery.js',
                        'widgets/tests/jasmineAMDErrorChecking.js'
                    ],
                    specs: specs,
                    host: 'http://localhost:8000'
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
            tasks: [
                'jasmine:main:build',
                'amdcheck',
                'jshint'
            ],
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
        },
        esri_slurp: {
            options: {
                version: '3.10'
            },
            dev: {
                options: {
                    beautify: true
                },
                dest: 'vendor/esri'
            },
            travis: {
                dest: 'vendor/esri'
            }
        },
        amdcheck: {
            main: {
                options: {
                    removeUnusedDependencies: false
                },
                files: [{
                    src: [
                        'widgets/**/*.js',
                        'modules/**/*.js'
                    ]
                }]
            }
        }
    });

    // Register tasks.
    for (var key in grunt.file.readJSON('package.json').devDependencies) {
        if (key !== 'grunt' && key.indexOf('grunt') === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    // Default task.
    grunt.registerTask('default', [
        'if-missing:esri_slurp:dev',
        'amdcheck',
        'jshint',
        'connect',
        'jasmine:main:build',
        'watch'
    ]);

    grunt.registerTask('travis', [
        'esri_slurp:travis',
        'jshint',
        'connect',
        'jasmine:main'
    ]);
};
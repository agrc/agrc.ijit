/* jshint camelcase:false */
module.exports = function(grunt) {
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
                    specs: ['**/tests/**/Spec*.js'],
                    host: 'http://localhost:8000'
                }
            }
        },
        jshint: {
            main: {
                src: [
                    'widgets/**/*.js',
                    'modules/**/*.js',
                    'resources/**/*.js',
                    'Gruntfile.js',
                    'ijit.profile.js'
                ]
            },
            options: {
                jshintrc: '.jshintrc',
                ignores: [
                    'resources/libs/**'
                ]
            }
        },
        watch: {
            files: [
                '**',
                '!_SpecRunner.html',
                '!**/node_modules/**',
                '!**/bower_components/**',
                '!**/vendor/**'
            ],
            tasks: [
                'jasmine:main:build',
                'amdcheck',
                'newer:jshint:main'
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
        'amdcheck',
        'newer:jshint:main',
        'connect',
        'jasmine:main:build',
        'watch'
    ]);

    grunt.registerTask('travis', [
        'jshint:main',
        'connect',
        'jasmine:main'
    ]);
};

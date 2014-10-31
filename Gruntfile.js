
module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        dev: 'dev',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= config.dev %>/scripts/{,*/}*.js'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= config.dev %>/scss/*.scss'],
                tasks: ['sass:dev'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                  livereload: '<%= connect.options.livereload %>'
                },
                files: [
                  '**.html',
                  '<%= config.dev %>/scss/*.scss'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                open: true,
                    base: [
                        '.tmp',
                        ''
                    ]
                }
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                expand: true,
                cwd: '<%= config.dev %>/scss/',
                src: ['*.scss'],
                dest: '<%= config.dist %>/styles/',
                ext: '.css'
            },
            dev: {
                options: {
                    style: 'expanded',
                    debugInfo: true,
                    lineNumbers: true
                },
                expand: true,
                cwd: '<%= config.dev %>/scss/',
                src: ['*.scss'],
                dest: '<%= config.dev %>/styles/',
                ext: '.css'
            }
        },

        concat: {
            dist: {
                src: [
                    '<%= config.dev %>/scripts/*.js'
                ],
                dest: '.tmp/scripts/main.js',
            }
        },

        uglify: {
            dist: {
                src: '.tmp/scripts/main.js',
                dest: '<%= config.dist %>/scripts/main.min.js'
            }
        },

        clean: {
            dist: {
                src: [".tmp/"]
            }
        },

        wiredep: {
            app: {
                src: ['index.html'],
                exclude: ['bower_components/modernizr/modernizr.js']
            }
        },

        responsive_images: {
            dist: {
                options: {
                    engine: 'im'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        }
    });

    grunt.registerTask('dev', function (target) {

        grunt.task.run([
            'connect:livereload',
            'sass:dev',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'responsive_images',
        'sass:dist',
        'concat:dist',
        'uglify:dist',
        'clean:dist'
    ]);

    grunt.registerTask('default', [

    ]);
};

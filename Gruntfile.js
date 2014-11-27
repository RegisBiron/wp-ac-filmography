
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    var config = {
        dev: 'dev',
        dist: 'dist'
    };

    grunt.initConfig({

        config: config,

        watch: {
            js: {
                files: ['<%= config.dev %>/js/**/*.js'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= config.dev %>/scss/**/*.scss'],
                tasks: ['sass:dev'],
                options: {
                    livereload: true
                }
            },
            autoprefixer: {
                files: ['.tmp/styles/*.css'],
                tasks: ['autoprefixer:dev'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                  livereload: '<%= connect.options.livereload %>'
                },
                files: [
                  '**/*.html',
                  '<%= config.dev %>/scss/**/*.scss'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                hostname: '0.0.0.0'
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
                dest: '.tmp/styles/',
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
                dest: '.tmp/styles/',
                ext: '.css'
            }
        },

        autoprefixer: {
            dist: {
                options: {
                    browsers: ['last 1 version'],
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '*.css',
                    dest: '<%= config.dist %>/styles'
                }]
            },
            dev: {
                options: {
                    browsers: ['last 1 version'],
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '*.css',
                    dest: '<%= config.dev %>/styles/'
                }]
            }
        },

        // concat: {
        //     dist: {
        //         src: [
        //             '<%= config.dev %>/js/*.js'
        //         ],
        //         dest: '.tmp/js/main.js',
        //     }
        // },
        //
        // uglify: {
        //     dist: {
        //         src: '.tmp/js/main.js',
        //         dest: '<%= config.dist %>/js/main.min.js'
        //     }
        // },

        clean: {
            src: [".tmp/"]
        },

        responsive_images: {
            dist: {
                options: {
                    engine: 'im',
                    sizes: [{
                        width: 320,
                    },{
                        width: 640,
                    },{
                        width: 1024,
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dev %>/images',
                    src: '**/*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: ['**/*'],
                    cwd: '<%= config.dev %>/images',
                    dest: '<%= config.dist %>/images'
                }]
            }
        }
    });

    grunt.registerTask('dev', function (target) {

        grunt.task.run([
            'clean',
            'connect:livereload',
            'sass:dev',
            'autoprefixer:dev',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean',
        'responsive_images',
        'copy',
        'sass:dist',
        'autoprefixer:dist'
    ]);

    grunt.registerTask('default', [

    ]);
};

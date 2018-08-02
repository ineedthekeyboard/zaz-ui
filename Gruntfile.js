module.exports = function (grunt) {
    var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
    var proxyConfig = {
        dev: {
            host: 'localhost',
            port: 6001
        },
        heroku: {
            host: 'zaz-ui-rest.zazvata.com'
        }
    };
    var app = {
        endPoints: ['/api'],
        root: 'web',
        war: {
            name: 'zaz-ui',
            folder: 'war'
        },
        scripts: [
            'web/**/*.js',
            '!web/vendor/**/*.js',
            '!web/templates/**/*.js'
        ]
    };

    //not using HBS map due to handlebars-helper features for now
    // function getHBSMap() {
    //     var path = require('path');
    //     var files = {};
    //     grunt.file.expand({
    //         cwd: app.root
    //     }, '**/*.hbs').forEach(function (relpath) {
    //         var targetFile = path.join(app.root, relpath).replace(/\.hbs$/, '.template.js');
    //         files[targetFile] = path.join(app.root, relpath);
    //     });
    //     return files;
    // }

    function getCSSMap() {
        var path = require('path');
        var files = {};
        grunt.file.expand({
            cwd: app.root
        }, '**/*.scss').forEach(function (relpath) {
            var targetFile = path.join(app.root, relpath).replace(/\.scss$/, '.css');
            files[targetFile] = path.join(app.root, relpath);
        });
        return files;
    }

    function connectStatic(connect, dir) {
        return connect.static(require('path').resolve(dir));
    }

    require('time-grunt')(grunt);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    //to load grunt tasks from custom js files
    //grunt.loadTasks('./templates');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: app,

        concurrent: {
            target: {
                tasks: ['dev', 'watch'],
                options: {
                    logConcurrentOutput: true,
                    limit: 10
                }
            }
        },

        connect: {
            dev: {
                options: {
                    port: 5001,
                    hostname: '*',
                    keepalive: true,
                    //open: true,
                    middleware: function (connect) {
                        return [proxySnippet, connectStatic(connect, app.root)];
                    }
                }
            },
            proxies: app.endPoints.map(function (proxy) {
                var option = grunt.option('proxy') || 'dev';
                var config = proxyConfig[option];
                var split = option.split(':');

                if (!config) {
                    config = {
                        host: split[0],
                        port: split[1] || 80
                    };
                }
                return {
                    changeOrigin: true,
                    context: proxy,
                    host: config.host,
                    port: config.port
                };
            })
        },

        handlebars: {
            compile: {
                options: {
                    namespace: 'HBS',
                    processName: function (filepath) {
                        var $filepath = filepath.replace('.hbs', '');
                        $filepath = $filepath.replace(/^\/?web\//, '');
                        return $filepath;
                    },
                    amd: true
                },
                //for future use
                //files: getHBSMap()
                files: {
                    '<%= config.root %>/templates/hbs.js': '<%= config.root %>/**/*.hbs'
                }
            }
        },

        war: {
            target: {
                options: {
                    war_dist_folder: '<%= config.war.folder %>',
                    war_name: '<%= config.war.name %>',
                    webxml_display_name: '<%= config.war.name %>'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.war.folder %>',
                    src: ['**'],
                    dest: ''
                }]
            }
        },

        watch: {
            templates: {
                files: '<%= config.root %>/**/*.hbs',
                tasks: ['handlebars']
            },
            sass: {
                files: ['<%= config.root %>/**/*.{scss,sass}'],
                tasks: ['newer:sass']
            },
            css: {
                files: ['<%= config.root %>/**/*.css'],
                options: {
                    livereload: true
                }
            }
        },

        sass: {
            dist: {
                files: getCSSMap()
            }
        },
        
    });

    grunt.registerTask('dev', ['configureProxies', 'connect:dev']);
    grunt.registerTask('package', ['handlebars', 'war']);
    grunt.registerTask('serve', ['sass', 'handlebars', 'concurrent:target']);
    grunt.registerTask('default', ['serve']);
    grunt.registerTask('h', function() {
        grunt.option('proxy', 'heroku');
        grunt.task.run('serve');
    });
};
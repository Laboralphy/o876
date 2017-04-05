module.exports = function (grunt) {
    var srcDir = [
        "src/o2.js",
        "src/**/Mixin/**/*.js",
        "src/**/*.js"
    ];
    // Configuration de Grunt
    grunt.initConfig({
        // Concat
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: srcDir,
                // the location of the resulting JS file
                dest: 'dist/o876.js',
            },
            dev: {
                src: srcDir,
                dest: 'src/o876.js'
            }
        },

        // Uglify
        uglify: {
            options: {
                // Use these options when debugging
                // mangle: false,
                // compress: false,
                // beautify: true
            },
            dist: {
                files: {
                    'dist/o876.min.js': 'dist/o876.js'
                }
            }
        },

        // Concurrent
        concurrent: {
            options: {
                logConcurrentOutput: true,
                limit: 10
            },
            monitor: {
                tasks: ["watch:dev"]
            }
        },

        // Watch Files
        watch: {
            dev: {
                files: srcDir,
                tasks: ['dev'],
                options: {
                    interrupt: false,
                    spawn: false
                },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-concurrent');

    // Définition des tâches Grunt pour une sortie de release
    grunt.registerTask(
        'release',
        [
            'concat:dist',
            'uglify:dist'
        ]
    );

    // Concat la dev
    grunt.registerTask('dev', ['concat:dev']);

    // Monitor pour la dev
    grunt.registerTask('monitor', ["concurrent:monitor"]);

}
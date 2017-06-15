module.exports = function (grunt) {
    var srcDir = [
        "src/o2.js",
        "src/**/Mixin/**/*.js",
        "src/Fairies/Wings/*.js",
        "src/Fairies/Shape.js",
        "src/Fairies/Layer.js",
        "src/Fairies/Rect.js",
        "src/**/*.js",
    ];
    var testDir = [
        "tests/qunit/*.js"
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
            }
        },

        qunit: {
            all: ['tests/qunit/**/*.html']
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
                    'dist/o876.js': 'dist/o876.js'
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
                files: [srcDir, testDir],
                tasks: ['dev'],
                options: {
                    interrupt: false,
                    spawn: false
                },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Définition des tâches Grunt pour une sortie de release
    grunt.registerTask(
        'release',
        [
            'concat:dist',
            'uglify:dist'
        ]
    );

    // Concat la dev
    grunt.registerTask('dev', [
        'concat:dist',
        'qunit:all'
    ]);

    // Monitor pour la dev
    grunt.registerTask('monitor', ["concurrent:monitor"]);

}

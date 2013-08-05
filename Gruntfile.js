'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    vars: {
      coffee_source_dir: "source/coffee",
      js_build_dir: "build",
      sass_dir: "source/sass",
      js_dir: "js",
      css_dir: "css",
    },
    compass: {
      app: {
        options: {
          config: "config.rb"
        }
      }
    },
    htmlhint: {
      app: {
        options: {
          'tag-pair': true
        },
        src: ['*.html'],
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          keepalive: true,
          base: '.',
          static: '.'
        }
      }
    },
    'closure-compiler': {
      frontend: {
        closurePath: '/home/d1mmmk/closure-compiler',
        js: '<%= vars.js_build_dir %>/application.js',
        jsOutputFile: '<%= vars.js_dir %>/application.min.js',
        // maxBuffer: 500,
        noreport: true,
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          // source_map_format: "V2",
          externs: [
            // '<%= vars.js_dir %>/jquery.min.js', 
            ],
          formatting: 'pretty_print',
          warning_level: 'QUIET',
          // language_in: 'ECMASCRIPT5_STRICT'
        }
      }
    },
    coffee: {
      app: {
        files: {
          '<%= vars.js_build_dir %>/application.js': '<%= vars.coffee_source_dir %>/application.coffee',
        }
      },
    },
    watch: {
      js: {
        files: [
          '<%= vars.coffee_source_dir %>/**/*.coffee',
          ],
        tasks: ['coffee','closure-compiler']
      },
      css: {
        files: "<%= vars.sass_dir %>/**/*.scss",
        tasks: ['compass'],
        options: {
          livereload: 1337,
        },
      },
      html: {
        files: "*.html",
        tasks: ['htmlhint'],
        options: {
          livereload: 1337,
        },
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
        // max_jshint_notifications: 5, // maximum number of notifications from jshint output
        title: "HireRight" // defaults to the name in package.json, or uses project's directory name, you can change to the name of your project
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-htmlhint');
  grunt.loadNpmTasks('grunt-notify');

  grunt.task.run('notify_hooks');

  // Default task.
  grunt.registerTask('default', ['connect']);

};

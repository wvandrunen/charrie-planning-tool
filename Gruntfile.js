module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['client', 'server']
    },
    watch: {
      scripts: {
        files: [
          'client/**/*.js',
          'server/**/*.js'
        ],
        tasks: ['jshint'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint']);
};

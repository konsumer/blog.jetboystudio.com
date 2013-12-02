'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		'wintersmith': {
			'build': {},
			'preview': {
				'options': {
					'action': "preview"
				}
			}
		},
		
		'gh-pages': {
			options: {
				base: 'build'
			},
			src: '**/*'
		},
		
		'clean': {
			'default': ["build"],
		},
	});

	grunt.registerTask('deploy', ['wintersmith:build', 'gh-pages']);
	grunt.registerTask('default', ['clean', 'deploy']);
};
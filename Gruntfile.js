/*jshint node: true */

'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			all: ['test/index.html']
		},
		jasmine: {
			src: 'src/**/*.js',
			options: {
				vendor: [
					'http://code.jquery.com/jquery-1.11.1.min.js',
					'vendor/jasmine-reporter.js'
				],
				specs: 'spec/**/*.js',
				// So we can view specs in a browser as well...
				keepRunner: true
			}
		},
		jshint: {
			files: [
				'Gruntfile.js',
				'src/**/*.js'
				// TODO 'spec/**/*.js'
			],
			options: {
				jshintrc: true
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
			},
			build: {
				files: {
					'build/jquery.cookie-<%= pkg.version %>.min.js': 'src/jquery.cookie.js'
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			files: [
				'src/**/*.js',
				'spec/**/*.js'
			],
			tasks: ['default']
		},
		compare_size: {
			files: [
				'build/jquery.cookie-<%= pkg.version %>.min.js',
				'src/jquery.cookie.js'
			],
			options: {
				compress: {
					gz: function (fileContents) {
						return require('gzip-js').zip(fileContents, {}).length;
					}
				}
			}
		},
		connect: {
			saucelabs: {
				options: {
					port: 9999
				}
			},
			tests: {
				options: {
					port: 9998,
					open: 'http://127.0.0.1:9998/test/index.html',
					keepalive: true,
					livereload: true
				}
			},
			specs: {
				options: {
					port: 3000,
					open: 'http://127.0.0.1:3000/_SpecRunner.html',
					keepalive: true,
					livereload: true
				}
			}
		},
		'saucelabs-qunit': {
			all: {
				options: {
					urls: ['http://127.0.0.1:9999/test/index.html'],
					build: process.env.TRAVIS_JOB_ID,
					browsers: [
						// iOS
						{
							browserName: 'iphone',
							platform: 'OS X 10.9',
							version: '7.1'
						},
						{
							browserName: 'ipad',
							platform: 'OS X 10.9',
							version: '7.1'
						},
						// Android
						{
							browserName: 'android',
							platform: 'Linux',
							version: '4.3'
						},
						// OS X
						{
							browserName: 'safari',
							platform: 'OS X 10.9',
							version: '7'
						},
						{
							browserName: 'safari',
							platform: 'OS X 10.8',
							version: '6'
						},
						{
							browserName: 'firefox',
							platform: 'OS X 10.9',
							version: '28'
						},
						// Windows
						{
							browserName: 'internet explorer',
							platform: 'Windows 8.1',
							version: '11'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 8',
							version: '10'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '11'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '10'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '9'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '8'
						},
						{
							browserName: 'firefox',
							platform: 'Windows 7',
							version: '29'
						},
						{
							browserName: 'chrome',
							platform: 'Windows 7',
							version: '34'
						},
						// Linux
						{
							browserName: 'firefox',
							platform: 'Linux',
							version: '29'
						}
					]
				}
			}
		},
		'saucelabs-jasmine': {
			all: {
				options: {
					urls: ['http://127.0.0.1:9999/_SpecRunner.html'],
					tunnelTimeout: 5,
					build: process.env.TRAVIS_JOB_ID,
					concurrency: 3,
					browsers: [
						// iOS
						{
							browserName: 'iphone',
							platform: 'OS X 10.9',
							version: '7.1'
						},
						{
							browserName: 'ipad',
							platform: 'OS X 10.9',
							version: '7.1'
						},
						// Android
						{
							browserName: 'android',
							platform: 'Linux',
							version: '4.3'
						},
						// OS X
						{
							browserName: 'safari',
							platform: 'OS X 10.9',
							version: '7'
						},
						{
							browserName: 'safari',
							platform: 'OS X 10.8',
							version: '6'
						},
						{
							browserName: 'firefox',
							platform: 'OS X 10.9',
							version: '28'
						},
						// Windows
						{
							browserName: 'internet explorer',
							platform: 'Windows 8.1',
							version: '11'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 8',
							version: '10'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '11'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '10'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '9'
						},
						{
							browserName: 'internet explorer',
							platform: 'Windows 7',
							version: '8'
						},
						{
							browserName: 'firefox',
							platform: 'Windows 7',
							version: '29'
						},
						{
							browserName: 'chrome',
							platform: 'Windows 7',
							version: '34'
						},
						// Linux
						{
							browserName: 'firefox',
							platform: 'Linux',
							version: '29'
						}
					]
				}
			}
		},
	});

	// Loading dependencies
	for (var key in grunt.file.readJSON('package.json').devDependencies) {
		if (key !== 'grunt' && key.indexOf('grunt') === 0) {
			grunt.loadNpmTasks(key);
		}
	}

	grunt.registerTask('default', ['jshint', 'qunit', 'jasmine', 'uglify', 'compare_size']);
	grunt.registerTask('saucelabs', ['connect:saucelabs', 'saucelabs-qunit', 'saucelabs-jasmine']);
	grunt.registerTask('ci', ['jshint', 'qunit', 'jasmine', 'saucelabs']);
	grunt.registerTask('specs', ['jasmine', 'connect:specs']);
};

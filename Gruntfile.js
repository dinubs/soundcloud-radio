module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				files: {
					'public/stylesheets/style.css' : 'sass/stylesheets/style.scss'
				},
	            options: {
	                // loadPath: require('node-bourbon').with('other/path', 'another/path') 
	                // - or - 
	                loadPath: require('node-neat').includePaths
	            }
			}
		},
		browserify: {
			dist: {
				files: {
					'./public/javascripts/the.js': './javascripts/the.js'
				},
				options: {
					// transform: ['coffeeify']
				}
			}
		},

		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			},
			js: {
				files: './javascripts/*.js',
				tasks: ['browserify']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.registerTask('default',['watch']);
	grunt.registerTask('dev',['sass','jshint']);
}
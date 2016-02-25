module.exports = function(grunt) {


	grunt.initConfig({
		// remove unused CSS

		// Minify the CSS
		cssmin: {
			target: {
				files: [{
					src: ['src/material.min.css', 'src/styles.css'], dest: 'dist/result.min.css' }
				]}
		},
		// Rewrite the minifed stuff into the processed HTML file
		processhtml: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['*.html'],
					dest: './dist',
					ext: '.html'
				}]
			}
		},
		// Minify the HTML
		// htmlmin: {
		// 	dist: {
		// 		options: {
		// 			removeComments: true,
		// 			collapseWhitespace: true,
		// 			conservativeCollapse: true,
		// 			collapseBooleanAttributes: true,
		// 			removeAttributeQuotes: true,
		// 			removeRedundantAttributes: true,
		// 			keepClosingSlash: true,
		// 			minifyJS: true,
		// 			minifyCSS: true
		// 		},
		// 		files: [
		// 		{
		// 			expand: false,
		// 			cwd: 'src/',
		// 			src: ['*.html'],
		// 			dest: './',
		// 			ext: '.html'
		// 		}
		// 		]
		// 	}
		// }
	});

grunt.loadNpmTasks('grunt-contrib-cssmin');
//grunt.loadNpmTasks('grunt-htmlmin');
grunt.loadNpmTasks('grunt-processhtml');
grunt.registerTask('default', ['cssmin', 'processhtml']); //, 'htmlmin']);

};

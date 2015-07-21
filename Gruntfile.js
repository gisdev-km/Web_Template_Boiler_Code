"use strict";

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		open: {
			dev: {
		      path: "http://localhost:5000",
		    },
		    dist: {
		      path: "http://localhost:9999",
		    }
		},

		copy: {
			build: {
				cwd: "src",
				src: ["**", "!images/**", "!**/*.styl"],
				dest: "build",
				expand: true
			}
		},

		clean: {
			build: {
				src: ["build"]
			}
		},

		watch: {
			
			php: {
				files: ["src/**/*.php"]
			},

			js: {
				files: [
					"src/js/*.js",
					"Gruntfile.js"
				],
				tasks: ["jshint"]
			},
			stylus: {
				files: [
					"src/css/*.styl",
				],
				tasks: ["stylus", "autoprefixer"]
			},
			css: {
				files: [
					"src/**/*.css"
				], 
				tasks: ["bsReload:css"]
			},
			options: {
     			livereload: true,
     			livereloadOnError: false
    		}
		},

		stylus: {
			build: {
				options: {
					linenos: false,
					compress: false,
					reload: true
				},
				files: [{
					expand: true,
					cwd: "src",
					src: [ "css/*.styl" ],
					dest: "src",
					ext: ".css"
				}]
			}
		},

		autoprefixer: {
			build: {
			    expand: true,
			    cwd: "src",
			    src: [ "**/*.css" ],
			    dest: "src"
	  		}
	  	},
		jshint: {
		  options: {
		  	jshintrc: ".jshintrc",
		    globals: {
		      dojo: true,
		      jQuery: true,
		      console: true,
		      module: true
		    }
		  },
		  all: ["Gruntfile.js", "src/js/*.js"]
		},
		
		imagemin: {
		    dynamic: {
		        files: [{
		            expand: true,
		            cwd: "src/images/",
		            src: ["**/*.{png,jpg,gif}"],
		            dest: "build/images"
		        }]
		    }
		},

        php: {
        	dev: {
        		options: {
	                port: 5000,
	                base: "src",
	                
	            }

        	},
        	dist: {
	            options: {
	                port: 9999,
	                base: "build",
	                
	            }
        	}
    	},

    	browserSync: {
    		dev: {
    			bsFiles: {
    				src: [
    					"src/**/*.php",
    					"src/**/*.css"
					]
    			},
    			options: {
    				proxy: "127.0.0.1:5000",
    				port: 8080,
    				open: true,
    				watchTask: true
    			}

    		}
    	},
    	bsReload: {
            css: {
            	reload: "groundwater.css"
            },
            all: {
            	reload: true
            }
        },

        esri_slurp: {
	      options: {
	        version: "3.13"
	      },
	      dev: {
	        options: {
	          beautify: true
	        },
	        dest: "src/js/esri"
	      }
	    }
	});

	
	grunt.loadNpmTasks("grunt-browser-sync");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-stylus");
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks("grunt-newer");
	grunt.loadNpmTasks("grunt-contrib-copy"	);
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-php");
	grunt.loadNpmTasks("grunt-open");
	grunt.loadNpmTasks("grunt-esri-slurp");

  	//grunt.registerTask("default", ["server-dev", "open:dev", "watch"]);
	grunt.registerTask("default", ["server-dev", "browserSync", "watch"]);
  	grunt.registerTask("dist", ["build", "server-dist", "open:dist", "watch"]);
  	grunt.registerTask("slurp", ["esri_slurp:dev"]);
  	grunt.registerTask(
	  "stylesheets", 
	  "Compiles the stylesheets.", 
	  [ "stylus", "autoprefixer" ]
	);
  	grunt.registerTask(
  		"server-dev", 
  		"Runs Grunt-Connect", 
  		["php:dev"]
	);
	grunt.registerTask(
  		"server-dist", 
  		"Runs Grunt-Connect", 
  		["php:dist"]
	);

  	grunt.registerTask(
  		"build", 
  		"Compiles all assets and copies the files to the build directory", 
  		["clean", "copy", "newer:imagemin", "stylesheets"]
	);
};
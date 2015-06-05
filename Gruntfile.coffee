module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        autoprefixer:
            dist:
                src: 'dist/css/app.css'
                dest: 'dist/css/app.css'

        coffee:
            dist:
                expand: true
                flatten: true
                cwd: 'src/coffee'
                src: [ '*.coffee' ]
                dest: 'dist/js'
                ext: '.js'

        html2js:
            dist:
                src: 'src/templates/**/*.html'
                dest: 'dist/js/timeline.templates.js'
                module: 'sportily.timeline.templates'

        sass:
            dist:
                files:
                    'dist/css/app.css': 'src/scss/app.scss'

    grunt.loadNpmTasks 'grunt-autoprefixer'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-html2js'

    grunt.registerTask 'default', [ 'sass', 'autoprefixer', 'coffee', 'html2js' ]

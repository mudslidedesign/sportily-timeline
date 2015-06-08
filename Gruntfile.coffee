module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        autoprefixer:
            dist:
                src: 'dist/css/sportily.fixture.css'
                dest: 'dist/css/sportily.fixture.css'

        coffee:
            dist:
                src: 'src/coffee/**/*.coffee'
                dest: 'dist/js/sportily.fixture.js'

        html2js:
            dist:
                src: 'src/templates/**/*.html'
                dest: 'dist/js/sportily.fixture.templates.js'
                module: 'sportily.fixture.templates'

        sass:
            dist:
                files:
                    'dist/css/sportily.fixture.css': 'src/scss/sportily.fixture.scss'

        uglify:
            options:
                sourceMap: true
            dist:
                files:
                    'dist/js/sportily.fixture.min.js': [ 'dist/js/sportily.fixture.js', 'dist/js/sportily.fixture.templates.js' ]


    grunt.loadNpmTasks 'grunt-autoprefixer'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-html2js'

    grunt.registerTask 'default', [ 'sass', 'autoprefixer', 'coffee', 'html2js', 'uglify' ]

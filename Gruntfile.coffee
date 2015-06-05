module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        # add browser prefixes as necessary.
        autoprefixer:
            dist:
                src: 'public/css/app.css'
                dest: 'public/css/app.css'

        # compile coffeescript to raw javascript.
        coffee:
            dist:
                expand: true
                flatten: true
                cwd: 'src/coffee'
                src: [ '*.coffee' ]
                dest: 'public/js'
                ext: '.js'


        # compile sass/scss.
        sass:
            dist:
                files:
                    'public/css/app.css': 'src/scss/app.scss'

        # watch the source code for changes, trigger actions, then push built files to the server.
        watch:
            coffee:
                files: [ 'src/coffee/**/*.coffee' ]
                tasks: [ 'coffee' ]

            sass:
                files: [ 'src/scss/**/*.scss' ]
                tasks: [ 'sass', 'autoprefixer' ]

            livereload:
                files: [ '/**/*.{js,css,html}' ]
                options:
                    livereload: true


    # load grunt modules/tasks.
    grunt.loadNpmTasks 'grunt-autoprefixer'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-watch'

    # configure higher level grunt tasks.
    grunt.registerTask 'default', [
        'sass'
        'autoprefixer'
        'coffee'
        'watch'
    ]

module.exports = (grunt) ->

    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'

        # add browser prefixes as necessary.
        autoprefixer:
            dist:
                src: 'dist/css/app.css'
                dest: 'dist/css/app.css'

        # compile coffeescript to raw javascript.
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
                dest: 'dist/timeline-templates.js'
                module: 'sportily-timeline-templates'

        # build the config module.
        ngconstant:
            options:
                name: 'config'
                dest: 'dist/js/config.js'
            dev:
                constants: 'src/config/dev.json'
            prod:
                constants: 'src/config/prod.json'

        # compile sass/scss.
        sass:
            dist:
                files:
                    'dist/css/app.css': 'src/scss/app.scss'

        # watch the source code for changes, trigger actions, then push built files to the server.
        watch:
            coffee:
                files: [ 'src/coffee/**/*.coffee' ]
                tasks: [ 'coffee' ]

            sass:
                files: [ 'src/scss/**/*.scss' ]
                tasks: [ 'sass', 'autoprefixer' ]

            ngconstant:
                files: [ 'src/config/*.json' ]
                tasks: [ 'ngconstant:dev' ]

            livereload:
                files: [ '/**/*.{js,css,html}' ]
                options:
                    livereload: true


    # load grunt modules/tasks.
    grunt.loadNpmTasks 'grunt-autoprefixer'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-ng-constant'
    grunt.loadNpmTasks 'grunt-html2js'

    # configure higher level grunt tasks.
    grunt.registerTask 'default', [
        'sass'
        'autoprefixer'
        'coffee'
        'html2js'
        'ngconstant:dev'
        'watch'
    ]

    grunt.registerTask 'prod', [
        'sass'
        'autoprefixer'
        'coffee'
        'html2js'
        'ngconstant:prod'
    ]

module = angular.module 'sportily.fixture.filters', [ ]


module.filter 'person', ->
    (input) ->
        input.given_name + " " + input.family_name


String::ucfirst = ->
    @charAt(0).toUpperCase() + @slice 1


String::padLeft = (ch, len) ->
    if @length >= len then @ else (ch + @).padLeft(ch, len)


module.filter 'gameTime', ->
    (input) ->
        duration = moment.duration input
        hours = '' + duration.hours()
        minutes = '' + duration.minutes()
        seconds = '' + duration.seconds()
        str = minutes.padLeft('0', 2) + ':' + seconds.padLeft('0', 2)
        str = hours + ':' + str if duration.hours() > 0
        str


module.filter 'minutes', ->
    (input) ->
        ~~(input / 60000) + '’'


module.filter 'reverse', ->
    (input) ->
        input.slice().reverse() if input

module = angular.module 'sportily.fixture.service',  [ 'restangular' ]

#
# The fixture model object provides a convenient mechanism for working with
# fixtures and events of fixtures.
#
class Fixture

    constructor: (@q, @interval, @details, @events, @participants) ->
        @_updateGameState()
        @_linkEvent event for event in @events


    happenedAt: (time) ->
        [ minutes, seconds ] = time.split ':'
        @state.startedAt.clone().add(minutes, 'minutes').add(seconds, 'seconds').add(@state.pausedFor)


    addEvent: (event) ->
        promise = @_createEvent event
        promise.then(@_pushEvent).then(@_updateGameState).then(@_refreshDetails)
        promise


    deleteEvent: (event) ->
        promise = @_deleteEvent event
        promise.then(@_updateGameState).then(@_refreshDetails)
        promise


    start: (happened_at) ->
        @addEvent
            type: 'game_start'
            happened_at: happened_at


    finish: (happened_at) ->
        @addEvent
            type: 'game_finish'
            happened_at: happened_at


    pause: (happened_at) ->
        @addEvent
            type: 'game_pause'
            happened_at: happened_at


    resume: (happened_at) ->
        @addEvent
            type: 'game_resume'
            happened_at: happened_at


    addGoal: (entryId, ownGoal, participantId, notes, happened_at) ->
        @addEvent
            type: if ownGoal then 'own_goal' else 'goal'
            happened_at: happened_at
            entry_id: entryId
            participant_id: participantId
            notes: notes


    addAssist: (participantId, parentId, happened_at) ->
        @addEvent
            type: 'assist'
            happened_at: happened_at
            participant_id: participantId
            parent_id: parentId


    addFoul: (entryId, participantId, penaltySeconds, notes, happened_at) ->
        @addEvent
            type: 'foul'
            happened_at: happened_at
            entry_id: entryId
            participant_id: participantId
            penalty_seconds: penaltySeconds
            notes: notes


    getParticipants: (entryId) ->
        _.filter @participants, (p) => p.entry_id == entryId


    toggleParticipant: (member, entryId) ->
        if member.role
            participant = @_findParticipant member
            if participant
                @_removeParticipant participant
            else
                @_addParticipant member, entryId


    addParticipant: (member, entryId) ->
        if member.role
            participant = @_findParticipant member
            if participant
                @q.when participant
            else
                @_addParticipant member, entryId


    removeParticipant: (member, entryId) ->
        if member.role
            participant = @_findParticipant member
            if participant
                @_removeParticipant participant
            else
                @q.when true


    _addParticipant: (member, entryId) ->
        participant =
            fixture_id: @details.id
            role_id: member.role.id
            entry_id: entryId

        @participants.post(participant).then (participant) =>
            @participants.push participant
            @participants.lookup[participant.id] = participant


    _removeParticipant: (participant) ->
        participant.remove().then =>
            _.remove @participants, participant
            delete @participants.lookup[participant.id]


    _findParticipant: (member) ->
        _.find @participants, (p) -> p.role_id == member.role.id


    _createEvent: (event) ->
        event.fixture_id = @details.id
        event.happened_at = (event.happened_at ? moment()).format()
        @events.post event


    _pushEvent: (event) =>
        @events.push event
        @events.lookup[event.id] = event
        @_linkEvent event


    _deleteEvent: (event) ->
        event.remove().then =>
            _.remove @events, event
            delete @events.lookup[event.id]


    _linkEvent: (event) ->
        if event.parent_id
            parent = @events.lookup[event.parent_id]
            parent.children = [] unless parent.children
            parent.children.push event


    _startTimer: ->
        @timer = @interval @_updateGameTime, 500 unless @timer


    _stopTimer: ->
        @interval.cancel @timer if @timer
        @timer = undefined


    _refreshDetails: =>
        @details.get().then (res) =>
            @details = res


    refreshParticipants: ->
        @participants.get().then (res) =>
            @participants = res


    _updateGameTime: =>
        # calculate the regular game time, assuming real-time input.
        now = @state.pausedAt ? moment()
        @state.gameTime = now.diff(@state.startedAt) - @state.pausedFor

        # if there is an event with a greater game time, use that.
        [..., event] = @events
        @state.gameTime = Math.max @state.gameTime, event.game_time if event?


    _updateGameState: =>
        @state =
            inProgress: false
            started: false
            startedAt: null
            finished: false
            paused: false
            pausedAt: null
            pausedFor: 0
            gameTime: null

        happenedAt = null
        @events.forEach (event) =>
            happenedAt = moment event.happened_at

            switch event.type
                when 'game_start'
                    @state.started = true
                    @state.startedAt = happenedAt
                    @_startTimer()

                when 'game_finish'
                    @state.finished = true
                    @state.paused = true
                    @_stopTimer()

                when 'game_pause'
                    @state.paused = true
                    @state.pausedAt = happenedAt
                    @_stopTimer()

                when 'game_resume'
                    @state.paused = false
                    @state.pausedFor += happenedAt.diff @state.pausedAt
                    @state.pausedAt = null
                    @_startTimer()

            event.game_time = happenedAt.diff(@state.startedAt) - @state.pausedFor


        # the game is considered in progress when it's started, but not yet
        # finished, regardless of whether it's paused.
        @state.inProgress = @state.started && !@state.finished

        # ensure the game time starts off correctly.
        @_updateGameTime()


#
# The fixture service is responsible for fetching details and events for a
# fixture, then wrapping those details in a new fixture model object.
#
class FixtureService

    constructor: (@restangular, @q, @interval) ->

    get: (id) ->
        promises =
            details: @_details id
            events: @_events id
            participants: @_participants id

        @q.all(promises).then (data) =>
            { details, events, participants } = data
            new Fixture @q, @interval, details, events, participants

    _details: (id) ->
        @restangular.one('fixtures', id).get()

    _events: (id) ->
        @restangular.all('events').getList fixture_id: id

    _participants: (id) ->
        @restangular.all('participants').getList fixture_id: id


# expose the fixture service as an angular service.
module.service 'FixtureService', [ 'Restangular', '$q', '$interval', FixtureService ]

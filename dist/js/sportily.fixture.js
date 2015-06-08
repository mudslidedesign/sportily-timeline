(function() {
  var module;

  module = angular.module('sportily.fixture', ['restangular', 'sportily.fixture.config', 'sportily.fixture.filters', 'sportily.fixture.service', 'sportily.fixture.templates']);

  module.directive('sportilyFixture', function(FixtureService) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs, ctrl) {
        if (attrs.sportilyFixture) {
          return FixtureService.get(attrs.sportilyFixture).then(function(data) {
            return scope.fixture = data;
          });
        }
      }
    };
  });

  module.directive('sportilyTimeline', function() {
    return {
      restrict: 'E',
      require: '^sportilyFixture',
      templateUrl: 'templates/sportily/timeline/timeline.html'
    };
  });

  module.directive('sportilyScores', function() {
    return {
      restrict: 'E',
      require: '^sportilyFixture',
      templateUrl: 'templates/sportily/timeline/scores.html'
    };
  });

}).call(this);

(function() {
  var module;

  module = angular.module('sportily.fixture.config', ['restangular']);

  module.config(function(RestangularProvider) {
    var generateLookup;
    RestangularProvider.setBaseUrl('http://oauth.sporti.ly');
    RestangularProvider.setDefaultHeaders({
      Authorization: 'Bearer ' + window.localStorage.getItem('access_token')
    });
    RestangularProvider.setErrorInterceptor(function(response) {
      return console.error(response);
    });
    RestangularProvider.addResponseInterceptor(function(data, operation) {
      var result;
      result = null;
      if (operation === 'getList') {
        result = data.data;
        result.lookup = generateLookup(data.data);
      } else {
        result = data;
      }
      return result;
    });
    return generateLookup = function(items) {
      var i, item, len, result;
      result = {};
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        result[item.id] = item;
      }
      return result;
    };
  });

}).call(this);

(function() {
  var module;

  module = angular.module('sportily.fixture.filters', []);

  module.filter('person', function() {
    return function(input) {
      return input.given_name + " " + input.family_name;
    };
  });

  String.prototype.ucfirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  String.prototype.padLeft = function(ch, len) {
    if (this.length >= len) {
      return this;
    } else {
      return (ch + this).padLeft(ch, len);
    }
  };

  module.filter('gameTime', function() {
    return function(input) {
      var duration, hours, minutes, seconds, str;
      duration = moment.duration(input);
      hours = '' + duration.hours();
      minutes = '' + duration.minutes();
      seconds = '' + duration.seconds();
      str = minutes.padLeft('0', 2) + ':' + seconds.padLeft('0', 2);
      if (duration.hours() > 0) {
        str = hours + ':' + str;
      }
      return str;
    };
  });

  module.filter('minutes', function() {
    return function(input) {
      return ~~(input / 60000) + '’';
    };
  });

  module.filter('reverse', function() {
    return function(input) {
      if (input) {
        return input.slice().reverse();
      }
    };
  });

}).call(this);

(function() {
  var Fixture, FixtureService, module,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module = angular.module('sportily.fixture.service', ['restangular']);

  Fixture = (function() {
    function Fixture(q, interval, details1, events1, participants1) {
      var event, i, len, ref;
      this.q = q;
      this.interval = interval;
      this.details = details1;
      this.events = events1;
      this.participants = participants1;
      this._updateGameState = bind(this._updateGameState, this);
      this._updateGameTime = bind(this._updateGameTime, this);
      this._refreshDetails = bind(this._refreshDetails, this);
      this._pushEvent = bind(this._pushEvent, this);
      this._updateGameState();
      ref = this.events;
      for (i = 0, len = ref.length; i < len; i++) {
        event = ref[i];
        this._linkEvent(event);
      }
    }

    Fixture.prototype.happenedAt = function(time) {
      var minutes, ref, seconds;
      ref = time.split(':'), minutes = ref[0], seconds = ref[1];
      return this.state.startedAt.clone().add(minutes, 'minutes').add(seconds, 'seconds').add(this.state.pausedFor);
    };

    Fixture.prototype.addEvent = function(event) {
      var promise;
      promise = this._createEvent(event);
      promise.then(this._pushEvent).then(this._updateGameState).then(this._refreshDetails);
      return promise;
    };

    Fixture.prototype.deleteEvent = function(event) {
      var promise;
      promise = this._deleteEvent(event);
      promise.then(this._updateGameState).then(this._refreshDetails);
      return promise;
    };

    Fixture.prototype.start = function(happened_at) {
      return this.addEvent({
        type: 'game_start',
        happened_at: happened_at
      });
    };

    Fixture.prototype.finish = function(happened_at) {
      return this.addEvent({
        type: 'game_finish',
        happened_at: happened_at
      });
    };

    Fixture.prototype.pause = function(happened_at) {
      return this.addEvent({
        type: 'game_pause',
        happened_at: happened_at
      });
    };

    Fixture.prototype.resume = function(happened_at) {
      return this.addEvent({
        type: 'game_resume',
        happened_at: happened_at
      });
    };

    Fixture.prototype.addGoal = function(entryId, ownGoal, participantId, notes, happened_at) {
      return this.addEvent({
        type: ownGoal ? 'own_goal' : 'goal',
        happened_at: happened_at,
        entry_id: entryId,
        participant_id: participantId,
        notes: notes
      });
    };

    Fixture.prototype.addAssist = function(participantId, parentId, happened_at) {
      return this.addEvent({
        type: 'assist',
        happened_at: happened_at,
        participant_id: participantId,
        parent_id: parentId
      });
    };

    Fixture.prototype.addFoul = function(entryId, participantId, penaltySeconds, notes, happened_at) {
      return this.addEvent({
        type: 'foul',
        happened_at: happened_at,
        entry_id: entryId,
        participant_id: participantId,
        penalty_seconds: penaltySeconds,
        notes: notes
      });
    };

    Fixture.prototype.getParticipants = function(entryId) {
      return _.filter(this.participants, (function(_this) {
        return function(p) {
          return p.entry_id === entryId;
        };
      })(this));
    };

    Fixture.prototype.toggleParticipant = function(member, entryId) {
      var participant;
      if (member.role) {
        participant = this._findParticipant(member);
        if (participant) {
          return this._removeParticipant(participant);
        } else {
          return this._addParticipant(member, entryId);
        }
      }
    };

    Fixture.prototype.addParticipant = function(member, entryId) {
      var participant;
      if (member.role) {
        participant = this._findParticipant(member);
        if (participant) {
          return this.q.when(participant);
        } else {
          return this._addParticipant(member, entryId);
        }
      }
    };

    Fixture.prototype.removeParticipant = function(member, entryId) {
      var participant;
      if (member.role) {
        participant = this._findParticipant(member);
        if (participant) {
          return this._removeParticipant(participant);
        } else {
          return this.q.when(true);
        }
      }
    };

    Fixture.prototype._addParticipant = function(member, entryId) {
      var participant;
      participant = {
        fixture_id: this.details.id,
        role_id: member.role.id,
        entry_id: entryId
      };
      return this.participants.post(participant).then((function(_this) {
        return function(participant) {
          _this.participants.push(participant);
          return _this.participants.lookup[participant.id] = participant;
        };
      })(this));
    };

    Fixture.prototype._removeParticipant = function(participant) {
      return participant.remove().then((function(_this) {
        return function() {
          _.remove(_this.participants, participant);
          return delete _this.participants.lookup[participant.id];
        };
      })(this));
    };

    Fixture.prototype._findParticipant = function(member) {
      return _.find(this.participants, function(p) {
        return p.role_id === member.role.id;
      });
    };

    Fixture.prototype._createEvent = function(event) {
      var ref;
      event.fixture_id = this.details.id;
      event.happened_at = ((ref = event.happened_at) != null ? ref : moment()).format();
      return this.events.post(event);
    };

    Fixture.prototype._pushEvent = function(event) {
      this.events.push(event);
      this.events.lookup[event.id] = event;
      return this._linkEvent(event);
    };

    Fixture.prototype._deleteEvent = function(event) {
      return event.remove().then((function(_this) {
        return function() {
          _.remove(_this.events, event);
          return delete _this.events.lookup[event.id];
        };
      })(this));
    };

    Fixture.prototype._linkEvent = function(event) {
      var parent;
      if (event.parent_id) {
        parent = this.events.lookup[event.parent_id];
        if (!parent.children) {
          parent.children = [];
        }
        return parent.children.push(event);
      }
    };

    Fixture.prototype._startTimer = function() {
      if (!this.timer) {
        return this.timer = this.interval(this._updateGameTime, 500);
      }
    };

    Fixture.prototype._stopTimer = function() {
      if (this.timer) {
        this.interval.cancel(this.timer);
      }
      return this.timer = void 0;
    };

    Fixture.prototype._refreshDetails = function() {
      return this.details.get().then((function(_this) {
        return function(res) {
          return _this.details = res;
        };
      })(this));
    };

    Fixture.prototype.refreshParticipants = function() {
      return this.participants.get().then((function(_this) {
        return function(res) {
          return _this.participants = res;
        };
      })(this));
    };

    Fixture.prototype._updateGameTime = function() {
      var event, now, ref, ref1;
      now = (ref = this.state.pausedAt) != null ? ref : moment();
      this.state.gameTime = now.diff(this.state.startedAt) - this.state.pausedFor;
      ref1 = this.events, event = ref1[ref1.length - 1];
      if (event != null) {
        return this.state.gameTime = Math.max(this.state.gameTime, event.game_time);
      }
    };

    Fixture.prototype._updateGameState = function() {
      var happenedAt;
      this.state = {
        inProgress: false,
        started: false,
        startedAt: null,
        finished: false,
        paused: false,
        pausedAt: null,
        pausedFor: 0,
        gameTime: null
      };
      happenedAt = null;
      this.events.forEach((function(_this) {
        return function(event) {
          happenedAt = moment(event.happened_at);
          switch (event.type) {
            case 'game_start':
              _this.state.started = true;
              _this.state.startedAt = happenedAt;
              _this._startTimer();
              break;
            case 'game_finish':
              _this.state.finished = true;
              _this.state.paused = true;
              _this._stopTimer();
              break;
            case 'game_pause':
              _this.state.paused = true;
              _this.state.pausedAt = happenedAt;
              _this._stopTimer();
              break;
            case 'game_resume':
              _this.state.paused = false;
              _this.state.pausedFor += happenedAt.diff(_this.state.pausedAt);
              _this.state.pausedAt = null;
              _this._startTimer();
          }
          return event.game_time = happenedAt.diff(_this.state.startedAt) - _this.state.pausedFor;
        };
      })(this));
      this.state.inProgress = this.state.started && !this.state.finished;
      return this._updateGameTime();
    };

    return Fixture;

  })();

  FixtureService = (function() {
    function FixtureService(restangular, q, interval) {
      this.restangular = restangular;
      this.q = q;
      this.interval = interval;
    }

    FixtureService.prototype.get = function(id) {
      var promises;
      promises = {
        details: this._details(id),
        events: this._events(id),
        participants: this._participants(id)
      };
      return this.q.all(promises).then((function(_this) {
        return function(data) {
          var details, events, participants;
          details = data.details, events = data.events, participants = data.participants;
          return new Fixture(_this.q, _this.interval, details, events, participants);
        };
      })(this));
    };

    FixtureService.prototype._details = function(id) {
      return this.restangular.one('fixtures', id).get();
    };

    FixtureService.prototype._events = function(id) {
      return this.restangular.all('events').getList({
        fixture_id: id
      });
    };

    FixtureService.prototype._participants = function(id) {
      return this.restangular.all('participants').getList({
        fixture_id: id
      });
    };

    return FixtureService;

  })();

  module.service('FixtureService', ['Restangular', '$q', '$interval', FixtureService]);

}).call(this);

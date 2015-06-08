module = angular.module 'sportily.fixture', [
    'restangular'
    'sportily.fixture.config'
    'sportily.fixture.filters'
    'sportily.fixture.service'
    'sportily.fixture.templates'
]

module.directive 'sportilyFixture', [ 'FixtureService', (FixtureService) ->
    restrict: 'A'
    scope: true

    link: (scope, element, attrs, ctrl) ->
        if attrs.sportilyFixture
            FixtureService.get(attrs.sportilyFixture).then (data) ->
                scope.fixture = data;

]


module.directive 'sportilyTimeline', ->
    restrict: 'E'
    require: '^sportilyFixture'
    templateUrl: 'templates/sportily/fixture/timeline.html'


module.directive 'sportilyScores', ->
    restrict: 'E'
    require: '^sportilyFixture'
    templateUrl: 'templates/sportily/fixture/scores.html'

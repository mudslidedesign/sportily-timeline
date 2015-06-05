module = angular.module 'sportily-timeline', ['timeline.fixtures.service', 'timeline.config', 'timeline.filters', 'restangular', 'sportily-timeline-templates']
module.directive 'sportilyTimeline', ->
    restrict: 'E'
    controller: 'SportilyTimelineCtrl'
    templateUrl: 'templates/timeline.html'
    scope:
        competition_id: '=competitionId'
        organisation_id: '=organisationId'
        fixture_id: '=fixtureId'

module.controller 'SportilyTimelineCtrl', ($scope, FixtureService, Restangular) ->
    FixtureService.get($scope.fixture_id).then (data) ->
        $scope.fixture = data;


    Restangular.all('divisions').getList({ competition_id: $scope.competition_id}).then (data) ->
        $scope.divisions = data;

    Restangular.all('division-entries').getList({ competition_id: $scope.competition_id}).then (data) ->
        $scope.entries = data;

    Restangular.all('venues').getList({ organisation_id: $scope.organisation_id}).then (data) ->
        $scope.venue = data;

angular.module('sportily-timeline-templates', ['templates/assist.html', 'templates/foul.html', 'templates/game_finish.html', 'templates/game_pause.html', 'templates/game_resume.html', 'templates/game_start.html', 'templates/goal.html', 'templates/own_goal.html', 'templates/scores.html', 'templates/timeline.html']);

angular.module("templates/assist.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/assist.html",
    "");
}]);

angular.module("templates/foul.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/foul.html",
    "<div class=\"event event--foul\"\n" +
    "    ng-class=\"{ 'event--home' : event.entry_id == fixture.details.home_entry.id }\">\n" +
    "    <div class=\"event__time\">{{:: event.game_time | gameTime }}</div>\n" +
    "    <div class=\"event__icon\"><i class=\"fa fa-thumbs-down\"></i></div>\n" +
    "    <div class=\"event__panel\">\n" +
    "        <div class=\"event__description\">\n" +
    "            Foul committed by {{:: fixture.participants.lookup[event.participant_id].name | person }}\n" +
    "        </div>\n" +
    "        <div class=\"event__aux\" ng-if=\"event.penalty_seconds\">\n" +
    "            Awarded {{:: event.penalty_seconds / 60 }} penalty minutes\n" +
    "        </div>\n" +
    "        <div class=\"event__notes\" ng-if=\"event.notes\">\n" +
    "            “{{:: event.notes }}”\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div delete-event=\"event\" fixture=\"fixture\" name=\"Foul committed by {{:: fixture.participants.lookup[event.participant_id].name | person }}\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/game_finish.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/game_finish.html",
    "<div class=\"event event--flow\">Full-time</div>\n" +
    "");
}]);

angular.module("templates/game_pause.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/game_pause.html",
    "");
}]);

angular.module("templates/game_resume.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/game_resume.html",
    "");
}]);

angular.module("templates/game_start.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/game_start.html",
    "<div class=\"event event--flow\">Started at {{ event.happened_at | date : 'shortTime' }}</div>\n" +
    "");
}]);

angular.module("templates/goal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/goal.html",
    "<div class=\"event event--goal\"\n" +
    "    ng-class=\"{ 'event--home' : event.entry_id == fixture.details.home_entry.id }\">\n" +
    "    <div class=\"event__icon\"><i class=\"fa fa-star\"></i></div>\n" +
    "    <div class=\"event__panel\">\n" +
    "        <div class=\"event__time\">{{:: event.game_time | gameTime }}</div>\n" +
    "        <div class=\"event__description\">\n" +
    "            Goal! Scored by {{:: fixture.participants.lookup[event.participant_id].name | person }}.\n" +
    "        </div>\n" +
    "        <div class=\"event__aux\" ng-if=\"event.children\">\n" +
    "            Assisted by\n" +
    "            <span ng-repeat=\"child in event.children\">{{ $first ? '' : $last ? ' and ' : ', ' }}{{:: fixture.participants.lookup[child.participant_id].name | person }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"event__notes\" ng-if=\"event.notes\">\n" +
    "            “{{:: event.notes }}”\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div delete-event=\"event\" fixture=\"fixture\" name=\"Goal! Scored by {{:: fixture.participants.lookup[event.participant_id].name | person }}\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/own_goal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/own_goal.html",
    "<div class=\"event event--own_goal\"\n" +
    "    ng-class=\"{ 'event--home' : event.entry_id != fixture.details.home_entry.id }\">\n" +
    "    <div class=\"event__icon\"><i class=\"fa fa-star\"></i></div>\n" +
    "    <div class=\"event__panel\">\n" +
    "        <div class=\"event__time\">{{:: event.game_time | gameTime }}</div>\n" +
    "        <div class=\"event__description\">\n" +
    "            Own Goal!\n" +
    "        </div>\n" +
    "        <div class=\"event__notes\" ng-if=\"event.notes\">\n" +
    "            “{{:: event.notes }}”\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div delete-event=\"event\" fixture=\"fixture\" name=\"Own Goal!\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/scores.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/scores.html",
    "<h2>\n" +
    "    {{:: entries.lookup[fixture.details.home_entry.id].name }}\n" +
    "    <strong ng-if=\"fixture.details.home_entry.score != null\">\n" +
    "        &nbsp;\n" +
    "        {{ fixture.details.home_entry.score }}\n" +
    "    </strong>\n" +
    "    &nbsp;–&nbsp;\n" +
    "    <strong ng-if=\"fixture.details.away_entry.score != null\">\n" +
    "        {{ fixture.details.away_entry.score }}\n" +
    "        &nbsp;\n" +
    "    </strong>\n" +
    "    {{:: entries.lookup[fixture.details.away_entry.id].name }}\n" +
    "</h2>\n" +
    "\n" +
    "<div class=\"meta-info\">\n" +
    "    {{:: divisions.lookup[fixture.details.division_id].name }},\n" +
    "    {{:: fixture.details.start_time | date : 'longDate' }}\n" +
    "    @ {{:: fixture.details.start_time | date : 'shortTime' }},\n" +
    "    at {{:: venues.lookup[fixture.details.venue_id].name }}\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/timeline.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/timeline.html",
    "<ng-include src=\"'templates/scores.html'\"></ng-include>\n" +
    "\n" +
    "<h3>Timeline</h3>\n" +
    "\n" +
    "<ul class=\"timeline\">\n" +
    "    <li class=\"timeline__item\" ng-if=\"fixture.state.inProgress\">\n" +
    "        <div class=\"event event--flow\">{{ fixture.state.gameTime | gameTime }}</div>\n" +
    "    </li>\n" +
    "    <li class=\"timeline__item\"\n" +
    "        ng-repeat=\"event in fixture.events | reverse\"\n" +
    "        ng-include=\"'templates/' + event.type + '.html'\">\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

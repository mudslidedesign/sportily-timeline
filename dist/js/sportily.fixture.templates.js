angular.module('sportily.fixture.templates', ['templates/sportily/fixture/scores.html', 'templates/sportily/fixture/timeline.html', 'templates/sportily/fixture/timeline/assist.html', 'templates/sportily/fixture/timeline/foul.html', 'templates/sportily/fixture/timeline/game_endperiod.html', 'templates/sportily/fixture/timeline/game_finish.html', 'templates/sportily/fixture/timeline/game_pause.html', 'templates/sportily/fixture/timeline/game_resume.html', 'templates/sportily/fixture/timeline/game_start.html', 'templates/sportily/fixture/timeline/goal.html', 'templates/sportily/fixture/timeline/own_goal.html']);

angular.module("templates/sportily/fixture/scores.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/scores.html",
    "<span class=\"sportily-scores\">\n" +
    "    <span class=\"sportily-scores__home\">{{ fixture.details.home_entry.result.score }}</span>\n" +
    "    <span class=\"sportily-scores__vs\">–</span>\n" +
    "    <span class=\"sportily-scores__home\">{{ fixture.details.away_entry.result.score }}</span>\n" +
    "<span>\n" +
    "");
}]);

angular.module("templates/sportily/fixture/timeline.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline.html",
    "<ul class=\"timeline\">\n" +
    "    <li class=\"timeline__item\" ng-if=\"fixture.state.inProgress\">\n" +
    "        <div class=\"event event--flow\">{{ fixture.state.gameTime | gameTime }}</div>\n" +
    "    </li>\n" +
    "    <li class=\"timeline__item\"\n" +
    "        ng-repeat=\"event in fixture.events | reverse\"\n" +
    "        ng-include=\"'templates/sportily/fixture/timeline/' + event.type + '.html'\">\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("templates/sportily/fixture/timeline/assist.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/assist.html",
    "");
}]);

angular.module("templates/sportily/fixture/timeline/foul.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/foul.html",
    "<div class=\"event event--foul\"\n" +
    "    ng-class=\"{ 'event--home' : event.entry_id == fixture.details.home_entry.division_entry_id }\">\n" +
    "    <div class=\"event__icon\"><i class=\"fa fa-thumbs-down\"></i></div>\n" +
    "    <div class=\"event__panel\">\n" +
    "        <div class=\"event__time\">{{:: event.game_time | gameTime }}</div>\n" +
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

angular.module("templates/sportily/fixture/timeline/game_endperiod.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/game_endperiod.html",
    "<div class=\"event event--flow\">End Period</div>\n" +
    "");
}]);

angular.module("templates/sportily/fixture/timeline/game_finish.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/game_finish.html",
    "<div class=\"event event--flow\">Full-time</div>\n" +
    "");
}]);

angular.module("templates/sportily/fixture/timeline/game_pause.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/game_pause.html",
    "");
}]);

angular.module("templates/sportily/fixture/timeline/game_resume.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/game_resume.html",
    "");
}]);

angular.module("templates/sportily/fixture/timeline/game_start.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/game_start.html",
    "<div class=\"event event--flow\">Face-off</div>\n" +
    "");
}]);

angular.module("templates/sportily/fixture/timeline/goal.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/goal.html",
    "<div class=\"event event--goal\"\n" +
    "    ng-class=\"{ 'event--home' : event.entry_id == fixture.details.home_entry.division_entry_id }\">\n" +
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

angular.module("templates/sportily/fixture/timeline/own_goal.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/sportily/fixture/timeline/own_goal.html",
    "<div class=\"event event--own_goal\"\n" +
    "    ng-class=\"{ 'event--home' : event.entry_id != fixture.details.home_entry.division_entry_id }\">\n" +
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

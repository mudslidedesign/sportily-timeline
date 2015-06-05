(function() {
  var module;

  module = angular.module('app.filters', []);

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
      return input.slice().reverse();
    };
  });

  module.filter('fileIcon', function() {
    return function(input) {
      switch (input.mime) {
        case 'application/pdf':
          return 'fa-file-pdf-o';
        case 'application/zip':
        case 'application/gzip':
          return 'fa-file-archive-o';
        case 'image/gif':
        case 'image/jpeg':
        case 'image/png':
          return 'fa-file-image-o';
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
        case 'application/vnd.ms-powerpoint':
          return 'fa-file-powerpoint-o';
        default:
          return 'fa-file-o';
      }
    };
  });

}).call(this);

angular.module('app')

.directive('audioblock', function(soundsService) {
  var link = function(scope, element, attributes, requiredData) {
    soundsService.registerSoundLoaderFunction(function(newSoundUrl) {
      element.append('<audio style="display: none;" controls="" src="http://afctools.azurewebsites.net/Scripts/beep.wav"></audio>');
      var children = element.children();
      var newAudio = children[children.length - 1];
      var removeBehaviorsRestrictions = function() {
        if (newAudio.load) newAudio.load();
        window.removeEventListener('keydown', removeBehaviorsRestrictions);
        window.removeEventListener('mousedown', removeBehaviorsRestrictions);
        window.removeEventListener('touchstart', removeBehaviorsRestrictions);
      };
      window.addEventListener('keydown', removeBehaviorsRestrictions);
      window.addEventListener('mousedown', removeBehaviorsRestrictions);
      window.addEventListener('touchstart', removeBehaviorsRestrictions);
      return newAudio;
    })
  }

  return {
    restrict: 'A',
    scope: {
      audiolist: '=',
      audioblock: '='
    },
    link: link
  }
});
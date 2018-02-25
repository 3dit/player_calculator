angular.module('app')

.directive('keypad', function() {
  var linker = function($scope, $element, $attrs) {
    //there has got to be an easier way to attach events using jquery or something
    var q = $element[0].querySelector(".uikeyboard");

    function unhilight(target) {
      setTimeout(function() { target.blur; }, 25);
    }

    for (var index = 0; index < q.children.length; index++) {
      if (q.children[index].attributes && q.children[index].attributes.hasOwnProperty('bval')) {
        q.children[index].onclick = function(d) {
          if(!d.target.attributes.bval) {
            var s = $(d.target).closest('svg');
            if(s) {
              var v = s.attr('bval');
              $scope.keyPressed({data : v});
              $scope.$apply();
            }
          } else {
            $scope.keyPressed({data : d.target.attributes.bval.value});
            $scope.$apply();
            unhilight(d.target);
          }
        }
      }
    }
  }

  return {
    restrict: 'A',
    link: linker,
    templateUrl: 'keypad.html',
    scope: {
      keyPressed: '&'
    }
  }
})
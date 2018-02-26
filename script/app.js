angular.module('app', [])

//lodash
.constant('_', window._)
  .run(['$rootScope', function($rootScope) {
    $rootScope._ = window._;
  }])

.controller('mainctrl', function($scope, calcService, soundsService, playerService, _, $timeout, $q) {

  $scope.display = 0;
  $scope.clearOnNextKey = false;
  $scope.sounds = {};
  
  soundsService.setSounds($scope.sounds);
  
  
  if(playerService.sessionExists()) $scope.hasPreExistingSession = true;
  
  playerService.defaults(); 

  $scope.restoreSession = function() {
    if(confirm('Do you want to replace the existing session with the initial session?')) 
      $scope.players = playerService.restoreInitialSession();
      $scope.hasPreExistingSession = false;
      soundsService.giveMeMoneySound();
  }
  
  $scope.players = playerService.allPlayers();

  $scope.selectedPlayer = null;
  $scope.lastTransaction = 0;
  $scope.fromMode = false;
  $scope.toMode = false;
  $scope.lastFromTransaction = 0;
  
  $scope.sequentalSecretDecimalPresses = 0;

  $scope.audiolist = 'this is original';

  soundsService.whenInitialized(function() {
    //var theSound = soundsService.createDynamicSound('http://afctools.azurewebsites.net/Scripts/beep.wav');
    //theSound.play();

    //function randomBeep() {
    //  var randomInterval = Math.random()*400+50;
    //  setTimeout(function() {
    //    soundsService.playDynamicBeep(); 
    //    randomBeep();
    //  },randomInterval)
    //} 
    //randomBeep();
  })


  soundsService.setSoundsLoadedCallback(function() {
    soundsService.setMode('allbeeps');
    //soundsService.giveMeMoneySound();
  });

  $scope.keyPressed = function(keyData) {
    //secret deciaml 4x press to get 'give me money' sound
    if (keyData == 'Decimal') {
      if($scope.sequentalSecretDecimalPresses > 2) {
      soundsService.giveMeMoneySound();
      $scope.sequentalSecretDecimalPresses = 0;
      calcService.doCalc('Clear');
      return;
      }
      $scope.sequentalSecretDecimalPresses++;
    } else {
      $scope.sequentalSecretDecimalPresses = 0;
    }
    
    if ($scope.clearOnNextKey) {
      $scope.display = 0;
      $scope.clearOnNextKey = false;
      calcService.doCalc('Clear');
    }
    $scope.toMode = false;
    $scope.fromMode = false;
    $scope.lastFromTransaction = 0;
    var currentValue = calcService.doCalc(keyData);
    $scope.display = currentValue;
    soundsService.buttonSound();
    $scope.lastFromTransaction = 0;

  }

  $scope.addPlayer = function() {
    console.log('added palyer ' + $scope.newPlayerName);
    if ($scope.newPlayerName) {
      playerService.addPlayer($scope.newPlayerName);
      console.log('players', self.players);
      self.players = playerService.allPlayers();
    }
    $scope.newPlayerName = '';
  }
  
  $scope.selectPlayer = function(player) {
    $scope.selectedPlayer = player;
    $scope.clearOnNextKey = true;
    if ($scope.fromMode === true || $scope.toMode === true) {
      soundsService.cashRegisterSound();
      var amount = 0;
      if ($scope.fromMode === true) amount = -$scope.display;
      if ($scope.toMode === true) amount = $scope.display;
      player.transactAmount(amount);
      $scope.hasPreExistingSession= false;
    } else {
      soundsService.bigButtonSound();
    }
  }

  $scope.classFor = function(id) {
    if ($scope.selectedPlayer && id == $scope.selectedPlayer.id) return 'selected playerbox';
    else return 'playerbox';
  }

  $scope.toAction = function() {
    $scope.display = calcService.doCalc('Equals');
    $scope.toMode = !$scope.toMode;
    $scope.fromMode = false;
    soundsService.bigButtonSound();
  }

  $scope.getToActionClass = function() {
    return $scope.toMode === true ? 'userButtonToMode' : 'toAction';
  }

  $scope.fromAction = function() {
    $scope.display = calcService.doCalc('Equals');
    $scope.fromMode = !$scope.fromMode;
    $scope.toMode = false;
    soundsService.bigButtonSound();
  }

  $scope.getFromActionClass = function() {
    return $scope.fromMode === true ? 'userButtonFromMode userbuttons' : 'fromAction userbuttons';
  }

  $scope.selectedUserPreferences = function() {
    $scope.userPreferencesPanel = !$scope.userPreferencesPanel;
  }
  
  $scope.deleteSelectedPlayer = function(selectedPlayer) {
    if(confirm('Do you REALLY want me to delete this player?')) {
      alert('deleted');
    }  
  }
  
  $scope.getUserButtonClass = function(player) {
    if ($scope.fromMode) return 'userButtonFromMode';
    else if ($scope.toMode) return 'userButtonToMode';
    else return 'userButton';
  }

})
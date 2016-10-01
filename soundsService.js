
angular.module('app')
.service('soundsService',function() {
  
  var currentButtonSound = 0;
  var currentBigButtonSound = 0;
  var currentRegisterSound = 0;
  var smallButtonSoundList = [];
  var bigButtonSoundList = [];
  var cashRegisterSoundList = [];
  var soundsLoadedCallback = null;
  var sounds = {};
  var initialized = false;
  var soundManifest = ['sound1','sound2','sound3','sound4','bigsound1','bigsound2','givememoney','cashregister1','cashregister2'];
  this.mode = 'default';
  var soundLoader = null;
  var readyCallback = null;
  
  var dynamicBeeps = [];
  var dynamicBeepIndex = 0;
  
  function allSoundsLoaded() {
      var loadCount = 0;
      for(var index in soundManifest) {
        var soundName = soundManifest[index];
        if(sounds.hasOwnProperty(soundName)) {
          loadCount++;
        }
      }
      //console.log('loadCount is %s and soundManifest.length is ',loadCount, soundManifest.length);
      return (loadCount == soundManifest.length);
  }
  
  function setSounds(theSounds) {
    sounds = theSounds;
    checkProgress = 0;
    var loadCheckInterval = setInterval(function() {
      if(allSoundsLoaded()) {
        clearInterval(loadCheckInterval);
        initialized = true;
        smallButtonSoundList = [sounds.sound1, sounds.sound2, sounds.sound3, sounds.sound4];
        bigButtonSoundList = [sounds.bigsound1, sounds.bigsound2];
        giveMeMoneySound = sounds.givememoney;
        cashRegisterSoundList = [sounds.cashregister1, sounds.cashregister2];
        beepSoundList = [sounds.beep1, sounds.beep2, sounds.beep3];
        if(soundsLoadedCallback) soundsLoadedCallback();
      }
      else checkProgress++;
      if(checkProgress > 50 /* 5 seconds */) {
        console.warn('sounds did not all load');
        clearInterval(loadCheckInterval);
      }
    }, 100);
    
  }
  
  function buttonSound() {
    if(!initialized) return;
    smallButtonSoundList[currentButtonSound].play();
    currentButtonSound++;
    if (currentButtonSound>=smallButtonSoundList.length) currentButtonSound = 0;
  }
  
  function bigButtonSound() {
    if(!initialized) return;
    bigButtonSoundList[currentBigButtonSound].play();
    currentBigButtonSound++;
    if(currentBigButtonSound >= bigButtonSoundList.length) currentBigButtonSound = 0;
  }
  
  var giveMeMoneySound = function() {
    if(!initialized) return;
    giveMeMoneySound.play();
  }
  
  var cashRegisterSound = function() {
    if(!initialized) return;
    cashRegisterSoundList[currentRegisterSound].play();
    currentRegisterSound++;
    if(currentRegisterSound >= cashRegisterSoundList.length) currentRegisterSound = 0;
  }
  
  function setSoundsLoadedCallback(callback) {
    soundsLoadedCallback = callback;
  }
  
  var setMode = function(mode) {
    if(mode=='allbeeps') {
      smallButtonSoundList = beepSoundList;
      bigButtonSoundList = beepSoundList;
    } 
  }
  
  //new dynamic approach
  function loadAllSounds() {
    dynamicBeeps.push(soundLoader('http://afctools.azurewebsites.net/Scripts/beep.wav'));
    dynamicBeeps.push(soundLoader('http://afctools.azurewebsites.net/Scripts/beep.wav'));
    dynamicBeeps.push(soundLoader('http://afctools.azurewebsites.net/Scripts/beep.wav'));
    dynamicBeeps.push(soundLoader('http://afctools.azurewebsites.net/Scripts/beep.wav'));
  }
  
  
  var playDynamicBeep = function() {
    dynamicBeeps[dynamicBeepIndex].play();
    dynamicBeepIndex++;
    if(dynamicBeepIndex>=dynamicBeeps.length) dynamicBeepIndex = 0;
  }
  
  var registerSoundLoaderFunction = function(soundLoaderFunction) {
    soundLoader = soundLoaderFunction;
    loadAllSounds();
    if(readyCallback) readyCallback(); 
  }
  
  var createDynamicSound = function(url) {
    if(soundLoader) return soundLoader(url);
    else console.log('NO UPDATER!');
  }
  
  var whenInitialized = function(callback) {
    readyCallback = callback;
  }

  return {
    setSounds: setSounds,
    buttonSound: buttonSound,
    bigButtonSound: bigButtonSound,
    giveMeMoneySound: giveMeMoneySound,
    cashRegisterSound: cashRegisterSound,
    setSoundsLoadedCallback: setSoundsLoadedCallback,
    setMode: setMode,
    registerSoundLoaderFunction: registerSoundLoaderFunction,
    createDynamicSound: createDynamicSound,
    whenInitialized: whenInitialized,
    playDynamicBeep: playDynamicBeep
  }
})



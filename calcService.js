angular.module('app')

.service('calcService', function( _) {
  var current = 0;
  var running = 0;

  var modes = {
    input: 0,
    plus: 1,
    minus: 2,
    none: 3
  };

  var mode = modes.none;
  var lastButton = null;
  var lastMode = null;

  function doCalc(button) {
    //console.log('');
    //console.log('enter mode %d\tcurrent %d\trunning %d', mode, current, running);
    //console.log('button', button);

    switch (button) {
      case "Clear":
        current = 0;
        if (lastButton === "Clear") running = 0;
        mode = modes.none;
        lastOperation = modes.none;
        break;

      case "Plus":
        current = operate(mode, current, running);
        mode = modes.plus;
        running = 0;
        break;

      case "Minus":
        current = operate(mode, current, running);
        mode = modes.minus;
        running = 0;
        break;

      case "Equals":
        current = operate(mode, current, running);
        running = 0;
        mode = modes.none;
        txService.tx(current);
        break;
        
      case "+/-":
        current = -current;
        break;

      default:
        var newdigit = Number(button);

        if (lastButton === 'Plus') {
          running = operate(mode, current, running);
        }
        if (lastButton === 'Minus') {
          running = operate(mode, current, running);
        }
        if (isFunction(lastButton)) current = 0;
        current = Number(current * 10 + newdigit);
        break;
    }

    //console.log('exit mode %d\tcurrent %d\trunning %d', mode, current, running);

    lastButton = button;

    lastMode = mode;

    return Number(current);
  }

  function operate(mode, current, running) {
    if (mode === modes.minus) return -running - current;
    if (mode === modes.plus) return running + current;
    return current;
  }

  function isFunction(button) {
    if (button === 'Plus' || button === 'Minus' || button === 'Equals') return true;
    return false;
  }

  function setCurrentValue(newValue) {
    current = newValue;
  }

  return {
    doCalc: doCalc,
    setCurrentValue: setCurrentValue
  }
})
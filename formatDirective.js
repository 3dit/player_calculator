angular.module('app')

  .directive('formatnumber', function () {

    return {
      restrict: 'A',
      scope: {
        formatnumber: '=',
        tx: '='
      },
      link: function (scope, element, attributes, data) {
        scope.$watch('tx', function (newValue, oldValue) {
          var digits = 12;
          var amount = newValue;
          amount = Number(amount);
          var absamount = amount > 0 ? amount : -amount;
          var digitLen = (absamount + '').length;
          var outClass = amount < 0 ? 'colorred' : 'colorblack';
          var output = '<span class="' + outClass + '">$';
          var amountS = absamount+'';
          var amountLen = amountS.length;
          var amountWithCommas = '';
          for(var i=0; i<amountLen;i++) {
            if((amountLen-i) % 3 === 0 && amountWithCommas !=='') amountWithCommas += '<span style="font-size:60%">,</span>';
            amountWithCommas += amountS.charAt(i);
          }
          for (var i = digitLen; i < digits; i++) {
            output += '&nbsp;';
          }
          if (amount < 0) output += '(' + amountWithCommas;
          else output += '&nbsp;' + amountWithCommas;
          output += '<sup class="cents">00</sup>';
          if (amount < 0) output += ')';
          output += "</span>";
          element.html(output);
        })
      }
    }
  })
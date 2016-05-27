(function() {
    'use strict';

    angular
        .module('app.core')
        .filter('myTMinuto', myTMinuto)
        .filter('myTSegundo', myTSegundo);




    function myTSegundo() {
        return function(number) {
          number = number%60;
          if(number<10) number = '0'+number.toString();
          return number;
        };
    }

    function myTMinuto() {
        return function(number) {
          return parseInt((number/60)%60);
        };
    }

 






    
})();




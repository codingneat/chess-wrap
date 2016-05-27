(function() {
    'use strict';

    angular
        .module('app.game')
        .config(appRun);

   
    function appRun($stateProvider, $urlRouterProvider, $locationProvider) {


        $stateProvider
         .state('game', {
            url: '/game',
            templateUrl: 'app/game/game.html',
            controller: 'Game as vm',
            resolve:{
                    "check":function($location,dataService){  
                        if(!dataService.user.getUser()) $location.path('/');  
                    }
            }
            

          });
    }

  
})();
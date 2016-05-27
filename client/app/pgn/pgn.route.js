(function() {
    'use strict';

    angular
        .module('app.room')
        .config(appRun);

   
    function appRun($stateProvider, $urlRouterProvider, $locationProvider) {


        $stateProvider
         .state('games', {
            url: '/games',
            templateUrl: 'app/pgn/games.html',
            controller: 'Games as vm'
          })
          .state('viewer', {
            url: '/viewer/:id',
            templateUrl: 'app/pgn/viewer.html',
            controller: 'Viewer as vm'
          });
    }

  
})();
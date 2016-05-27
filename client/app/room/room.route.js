(function() {
    'use strict';

    angular
        .module('app.room')
        .config(appRun);

   
    function appRun($stateProvider, $urlRouterProvider, $locationProvider) {


        $stateProvider
         .state('room', {
            url: '/room',
            templateUrl: 'app/room/room.html',
            controller: 'Room as vm',
            resolve:{
                    "check":function($location,dataService){  
                        if(!dataService.user.getUser()) $location.path('/');  
                    }
                }
          });
    }

  
})();
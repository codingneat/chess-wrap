(function() {
    'use strict';

    angular
        .module('app.home')
        .config(appRun);

   
    function appRun($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');


        $stateProvider
         .state('home', {
            url: '/',
            templateUrl: 'app/home/home.html',
            controller: 'Home as vm'
          });
    }

  
})();
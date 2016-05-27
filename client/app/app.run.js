(function () {
    'use strict';


     angular
      .module('app')
        .run(function($rootScope, $state, $window,  $location, dataService,socketFactory) {
              $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams, options) {


                  if(fromState.name==='game'&&dataService.flag.getFlag()!==1) {
                   var answer = confirm("Are you sure you want to leave this page?");
                    if (!answer) {
                      event.preventDefault();
                      return;
                    }else{
                      socketFactory.emit('disconnectUser', dataService.user.getUser(), function(data){
                        dataService.user.setUser(undefined);
                        event.preventDefault();
                        $state.go('home');
                      });
                    }
                    
                  }else if(toState.name==='home'&&dataService.user.getUser()) {
                      socketFactory.emit('disconnectUser', dataService.user.getUser(), function(data){
                        dataService.user.setUser('');
                        return;
                      });
                  }else if(dataService.flag.getFlag()===1){
                      dataService.flag.getFlag(0);
                    return;
                  }

              });

            $window.onbeforeunload = function (e) {
                e = e || window.event;

                if (e) {
                    e.returnValue = 'Are you sure you want to leave this page?';
                }



                return 'Are you sure you want to leave this page?';
              };
        });    






})();



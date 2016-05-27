(function () {
    'use strict';


    angular
        .module('app.home')
        .controller('Home', Home);

    function Home($scope,socketFactory,$state,dataService,logger) {

    	var vm = this; // jshint ignore: line

        // INIT

            if(dataService.user.getUser())  vm.name = dataService.user.getUser().name;

        // FUNCTIONS

        	vm.enter = function(name){
                socketFactory.emit('connectionName', { name: name }, function(data){
                    dataService.user.setUser(data);
                    logger.logSuccess('Bienvenido '+ name);
                	$state.go('room');
                });
            };

            $scope.$on('$destroy', function (event) {
                socketFactory.removeAllListeners();
            });
      
    }


})();



(function () {
    'use strict';


    angular
        .module('app.room')
        .controller('Room', Room);

    function Room($scope,$http,dataService,socketFactory,$state) {

    	var vm = this; // jshint ignore: line


        // INIT

            vm.myUser = dataService.user.getUser();
            vm.myUser.tipo = 0;
            vm.users = [];


        	$http.get('http://localhost:4000/try').then(function(data){
        		vm.users = data.data;
        	});



        // FUNCTIONS

            vm.play = function(user){
                var game = { begin: vm.myUser, chose: user  };
                socketFactory.emit('beginGame', game, function(data){
                    dataService.game.setGame(game);
                    vm.myUser.tipo = user.id;
                    dataService.user.setUser(vm.myUser);
                    vm.users = vm.users.filter(function check(user) {
                        return user.id !== game.begin.id && user.id !== game.chose.id ;
                    });
                    $state.go('game');
                });
            };



        // SOCKETS


        socketFactory.on('connectionUser', function(data){
            vm.users.push(data);
        });

        socketFactory.on('disconnectionUser', function(data){
            vm.users = vm.users.filter(function check(user) {
                return user.id !== data.id;
            });
        });

        socketFactory.on('gameBegin', function(data){
            var game = { begin: data.begin, chose: data.chose  };
            dataService.game.setGame(game);
            vm.myUser.tipo = data.begin.id;
            dataService.user.setUser(vm.myUser);
            vm.users = vm.users.filter(function check(user) {
                    return user.id !== data.begin.id && user.id !== data.chose.id ;
                });
            $state.go('game');
        });

        $scope.$on('$destroy', function (event) {
                socketFactory.removeAllListeners();
        });

        
      
    }


})();



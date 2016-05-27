(function () {
    'use strict';


    angular
        .module('app.pgn')
        .controller('Games', Games);

    function Games($scope,$http,dataService,socketFactory,$state) {

    	var vm = this; // jshint ignore: line


        // INIT

            vm.games = [];

        	$http.get('http://localhost:4000/try/games').then(function(data){
        		vm.games = data.data;
        	});


        // FUNCTIONS

            vm.watch = function(game){
                dataService.pgn.setPgn(game);
                $state.go('viewer',{id:game._id});
            };



        // SOCKETS



        
      
    }


})();



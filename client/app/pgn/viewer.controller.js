(function () {
    'use strict';


    angular
        .module('app.pgn')
        .controller('Viewer', Viewer);

    function Viewer($scope,$http,dataService,socketFactory,$state,$stateParams) {

        var vm = this; // jshint ignore: line


        $scope.boardA = '';
        vm.pos = 0;
        
        var gameData = [];
        var game = [];
        var pgnData = '';
        var obj = '';
        var chess = new Chess();

        if(dataService.pgn.getPgn()){
            pgnData = dataService.pgn.getPgn().pgn;
            init();
        }else{
            $http.get('http://localhost:4000/try/game/'+$stateParams.id).then(function(data){
                 pgnData = data.data.pgn;
                 init();
            });
        }

        function init(){
            obj = parsePgn(pgnData);
            chess.load_pgn(obj.pgn);
            gameData = chess.history();
            chess.reset();
            game = chess;
            vm.notation = obj.pgn.split(' ');
            vm.data = layout(obj);
        }





        



        vm.next = function(){
            if (vm.pos < gameData.length ) {
                vm.pos++;
                game.move(gameData[vm.pos-1]);
                $scope.boardA.position(game.fen());
            }
        };

        vm.prev = function(){
            if (vm.pos > 0) {
                vm.pos--;
                game.undo();
                $scope.boardA.position(game.fen());
            }
        };

        vm.start = function(){
            vm.pos = 0;
            game.reset();
            $scope.boardA.position(game.fen());
        };

        vm.end = function(){
            while (vm.pos < gameData.length ) {
                vm.pos++;
                game.move(gameData[vm.pos-1]);
            }
            $scope.boardA.position(game.fen());
        };

        vm.move = function(p){
            if(p>vm.pos) {
                while (vm.pos < p) {
                    vm.pos++;
                    game.move(gameData[vm.pos-1]);
                }
                $scope.boardA.position(game.fen());

            }else if(p<vm.pos){
                game.reset();
                vm.pos = 0;
                while (vm.pos < p) {
                    vm.pos++;
                    game.move(gameData[vm.pos-1]);
                }
                $scope.boardA.position(game.fen());
            }
        };


    }
      
})();

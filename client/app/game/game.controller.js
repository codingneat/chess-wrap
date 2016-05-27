(function () {
    'use strict';


    angular
        .module('app.game')
        .controller('Game', Game);

    function Game($scope,socketFactory,$state,$timeout,dataService,logger,$http) {

        var vm = this;  // jshint ignore: line

        // INIT

            $scope.boardA = '';
            vm.myUser = dataService.user.getUser();
            if(dataService.game.getGame()){
              vm.game = dataService.game.getGame();
            }else{
              $state.go('home');
            }
            
            dataService.game.setGame(undefined);
            vm.drawt = 0;

            if(vm.game.begin.id===vm.myUser.id){
                vm.color = "'white'";
                vm.color2 = "w";
                vm.adversary = vm.game.chose;
            }else{
                vm.color = "'black'";
                vm.color2 = "b";
                vm.adversary = vm.game.begin;
            }

            var game = new Chess();
            var gameData = game.history();
            vm.turn = game.turn();
            vm.notation = [];


        // FUNCTIONS

            vm.counter = 300;
            var flag = 0;
            var updateCounter = function() {
                 if(flag===1&&vm.counter!==0){
                   vm.counter--;
                 } 
                 if(vm.counter===0){
                  socketFactory.emit('specialMove', {user:vm.myUser,adversary: vm.adversary, move:'time'} , function(data){
                    vm.myUser.tipo = 0;
                    dataService.user.setUser(vm.myUser);
                    dataService.flag.setFlag(1);
                    logger.log('Perdiste por tiempo!');
                    $state.go('room');  
                  });
                 }else{
                  $timeout(updateCounter, 1000);
                 }
            };
            updateCounter();

            vm.counter2 = 300;
            var flag2 = 0;
            var updateCounter2 = function() {
                 if(flag2===1&&vm.counter2!==0) vm.counter2--;
                 $timeout(updateCounter2, 1000);
            };
            updateCounter2();

            vm.onDragStart = function(source, piece, position, orientation) {
                  if (game.game_over() === true ||
                      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                      (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
                      (game.turn() === 'w' && vm.color === "'black'" ) ||
                      (game.turn() === 'b' && vm.color === "'white'" )) {
                    return false;
                  }
            };

            vm.onDrop = function(source, target, piece, newPos, oldPos, orientation) {
                  var move = game.move({
                    from: source,
                    to: target,
                    promotion: 'q' 
                  });

                  if(move!== null){
                      flag = 0;
                      flag2 = 1;
                      vm.turn = game.turn();
                      vm.drawt = 0;
                      return;
                  }else{
                    return 'snapback';
                  }
            };

            vm.onSnapEnd = function(newLocation, oldLocation, source,piece, position, orientation) {
                  $scope.boardA.position(game.fen());
                  var move = {fen: game.fen(),move:game.history()[game.history().length-1],adversary: vm.adversary, user: vm.myUser, time: vm.counter};
                  if(game.game_over()) move.end = 1;
                  vm.notation.push(game.history()[game.history().length-1]);
                  socketFactory.emit('move', move);

                  if(game.game_over()){
                    if(game.in_checkmate()){
                      logger.log('Checkmate!');
                      gameEnd(vm.color2);
                    }else if(game.in_threefold_repetition()){
                      logger.log('In threefold repetition!');
                      gameEnd('h');
                    }else if(game.in_stalemate()){
                      logger.log('Stalemate!');
                      gameEnd('h');
                    }else{
                      logger.log('Draw!');
                      gameEnd('h');
                    }
                    dataService.flag.setFlag(1);
                    vm.myUser.tipo = 0;
                    dataService.user.setUser(vm.myUser);
                    $state.go('room');
                  }

            };



            vm.resign = function() {

              socketFactory.emit('specialMove', {user:vm.myUser,adversary: vm.adversary, move:'resign'} , function(data){
                vm.myUser.tipo = 0;
                dataService.user.setUser(vm.myUser);
                dataService.flag.setFlag(1);
                logger.log('Te has rendido!');
                $state.go('room');  
              });
            };

            vm.draw = function() {
              if(vm.drawt===0){
                socketFactory.emit('specialMove', {user:vm.myUser,adversary: vm.adversary, move:'draw'}, function(data){
                                      
                });
              }else{
                socketFactory.emit('specialMove', {user:vm.myUser,adversary: vm.adversary, move:'toDraw'}, function(data){
                  dataService.user.setUser(vm.myUser);
                  dataService.flag.setFlag(1);
                  $state.go('room'); 
               });
              }
            };


        // SOCKETS

            socketFactory.on('gameDisconnect', function(data){
                  dataService.flag.setFlag(1);
                  vm.myUser.tipo = 0;
                  dataService.user.setUser(vm.myUser);
                  if(data.evento===1){
                    logger.log('Your opponent has surrendered. You have win!');
                    gameEnd(vm.color2);
                  }else if(data.evento ===2){
                    logger.log("It's a draw!");
                  }else if(data.evento ===3){
                    logger.log("Your opponent's time is down. You have win!");
                    gameEnd(vm.color2);
                  }else{
                    logger.log('Your opponent. You have win!');
                    gameEnd(vm.color2);
                  }

                  $state.go('room');
            });

            socketFactory.on('move2', function(data){
                  $scope.boardA.position(data.fen);
                  var move = game.move(data.move);
                  vm.counter2 = data.time;
                  flag = 1;
                  flag2 = 0;
                  vm.turn = game.turn();
                  vm.notation.push(game.history()[game.history().length-1]);
                  if(game.game_over()){
                      if(game.in_checkmate()){
                        logger.log('You have lost. Checkmate!');
                      }else if(game.in_threefold_repetition()){
                        logger.log("It's a draw. In threefold repetition!");
                      }else if(game.in_stalemate()){
                        logger.log("It's a draw. Stalemate!");
                      }else{
                        logger.log("It's a draw.!");
                      }
                      dataService.flag.setFlag(1);
                      vm.myUser.tipo = 0;
                      dataService.user.setUser(vm.myUser);
                      $state.go('room');
                  }
            });

            socketFactory.on('toDraw', function(data){
                  logger.log('Tu adversario te ha propuesto tablas!');
                  vm.drawt = 1;
            });

            $scope.$on('$destroy', function (event) {
                socketFactory.removeAllListeners();
            });



            function gameEnd(result){
              var moves = game.history();
              var playerW, playerB, res;
              if(vm.color==='w'){
                playerW = vm.myUser.name;
                playerB = vm.adversary.name;
              }else{
                playerB = vm.myUser.name;
                playerW = vm.adversary.name;
              }

              if(result==="w"){
                res = '"1-0"';
              }else if(result==="b"){
                res = '"0-1"';
              }else if(result==="h"){
                res = '"1/2-1/2"';
              }

              var date = new Date();
              var month = date.getMonth()+1;
              var pgn = '[White "'+playerW+'"]'+' [Black "'+playerB+'"]';
              pgn = pgn + ' [Date "'+date.getFullYear()+'.'+month+'.'+date.getDate()+'"]';
              pgn = pgn + ' [Result '+res+'] ';

              var i = 0;
              _.forEach(game.history(),function(move){
                  if(i%2===0){
                    pgn = pgn+((i+2)/2)+'.'+move +' ';
                  }else{
                    pgn = pgn + move +' ';
                  }
                  i++;

              });

              $http.post('http://localhost:4000/try',{pgn:pgn,black:playerB,white:playerW});

              return pgn;   

              

            }





      
    }


})();



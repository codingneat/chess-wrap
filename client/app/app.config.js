

 (function () {
    'use strict';

    angular
    	.module('app')
    	.config(['nywtonChessboardConfigProvider', function nywtonChessConfigConfig(chessboardProvider) {
      		chessboardProvider.draggable(true)
        		.position('start')
        		.pieceTheme('img/chesspieces/wikipedia/{piece}.png');
    	}]);

   




})();



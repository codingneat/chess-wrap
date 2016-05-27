(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataService', dataService);

    function dataService($http) {
      
      var user;
      var game;
      var flag;
      var pgn;

        return {
            user: {
                getUser: function() {
                    return user;
                },
                setUser: function(value) {
                    user = value;
                }
            },
            game: {
                getGame: function() {
                    return game;
                },
                setGame: function(value) {
                    game = value;
                }
            },
            flag: {
                getFlag: function() {
                    return flag;
                },
                setFlag: function(value) {
                    flag = value;
                }
            },
            pgn: {
                getPgn: function() {
                    return pgn;
                },
                setPgn: function(value) {
                    pgn = value;
                }
            },

        };


    }

  


})();

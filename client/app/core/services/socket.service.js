(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('socketFactory', socketFactory);

    function socketFactory($rootScope,$timeout) {
      
        var url = window.location.href;
        var socket = io.connect("http://localhost:4000");

            return {
                on: function (eventName, callback) {
                    socket.on(eventName, function (error, message) {
                        var args = arguments;
                        $timeout(function() {
                            $rootScope.$apply(function () {
                                callback.apply(socket, args);
                            });
                        });
                       
                    });
                },
                emit: function (eventName, data, callback) {
                    socket.emit(eventName, data, function (error, message) {
                        var args = arguments;
                        $timeout(function() {
                            $rootScope.$apply(function () {
                                if (callback) {
                                    callback.apply(socket, args);
                                }
                            });
                        });
                    });
                },
                getSocket: function() {
                  return socket;
                },
                removeAllListeners: function (eventName, callback) {
                    socket.removeAllListeners(); 
                }
            };

    }



})();

(function () {
    'use strict';

    angular.module('app.core')
        .factory('logger', logger);

    function logger() {

    var logIt;


        // toastr setting.
        toastr.options = {
            "closeButton": true,
            "positionClass": "toast-top-right",
            "timeOut": "4000"
        };

        logIt = function(message, type) {
            return toastr[type](message);
        };

        return {
            log: function(message) {
                logIt(message, 'info');
            },
            logWarning: function(message) {
                logIt(message, 'warning');
            },
            logSuccess: function(message) {
                logIt(message, 'success');
            },
            logError: function(message) {
                logIt(message, 'error');
            }
        };

    }

})(); 


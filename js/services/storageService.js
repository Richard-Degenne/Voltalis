'use strict';
app.factory('LocalStorage', ['$window', function($window) {
    return {
        add: function(name, value) {
           
            $window.localStorage[name] = JSON.stringify(value);
        },
        get: function(name) {
            return JSON.parse($window.localStore[name] || '');
        },
    };
}]);

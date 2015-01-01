'use strict';
app.factory('loginService', function ($http, $location, sessionService) {
    return {
        login: function (data, scope) {
            var $promise = $http.post('http://ingenieurs-scientifiques-npdc.fr/data/user.php', data); //envois data vers user.php
            $promise.then(function (msg) {
                var uid = msg.data;
                var reponse = msg.data;
                //console.log(reponse);
                if (reponse == "sucess") {
                    scope.msgtxt = 'information correct';
                    sessionService.set('user', reponse);
                    $location.path('/villes');
                }
                else {
                    scope.msgtxt = 'information incorrect';
                    $location.path('/login');
                }
            });
        },
        logout: function () {
            sessionService.destroy('user');
            $location.path('/login');
        },
        islogged: function () {

            if (sessionService.get('user')) return true;
            else return false;

        }
    }

});
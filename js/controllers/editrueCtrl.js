'use strict';


app.controller('EditrueController', ['$scope', '$routeParams', 'loginService', 'UserService', 'LocalStorage', '$webSql', '$location', function ($scope, $routeParams, loginService, UserService, LocalStorage, $webSql, $location) {

    $scope.rue = [];
    $scope.defaultrue = [{
        nom: ''


    }];


    $scope.rue2 = [];
    $scope.rue_id = $routeParams.id;
    var initDB = function () {
        $scope.db = $webSql.openDatabase('Voltalis', '1.0', 'database', 2000000);

        $scope.db.createTable('rues', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "nom": {
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "ville": {
                "type": "INTEGER",
                "null": "NOT NULL"
            }
        });
    };


    initDB();
    var rue_id = $routeParams.id;

    $scope.db.select("rues", {
        "id": {
            "value": rue_id
        }
    }).then(function (results) {


        for (var i = 0; i < results.rows.length; i++) {
            $scope.rue2.push(results.rows.item(i));
        }
        $scope.rue = angular.copy($scope.rue2[0]);


    });


    $scope.retourrues = function (ville) {

        var earl = '/rues/' + ville;
        $location.path(earl);

    };

    $scope.annuler = function () {

        $scope.rue = angular.copy($scope.rue2[0]);

        $scope.retourrues($scope.rue.ville);

// var earl = '/adresses/';
//     $location.path(earl);
    };


    $scope.update = function (rue) {
        initDB();
        var settings = $.extend({}, $scope.defaultrue[0], rue);

        var nom = settings.nom;


        $scope.db.update('rues', {
            "nom": nom


        }, {"id": $scope.rue_id});
        $scope.retourrues();
    };


    //$scope.ville = UserService.model.ville;
    $scope.model = UserService.model;
    $scope.logout = function () {
        loginService.logout();
    };


}]);



'use strict';


app.controller('EditvilleController', ['$scope', '$routeParams', 'loginService', 'UserService', 'LocalStorage', '$webSql', '$location', function ($scope, $routeParams, loginService, UserService, LocalStorage, $webSql, $location) {

    $scope.ville = [];
    $scope.defaultville = [{
        Commune: '',
        Codepos: ''


    }];


    $scope.ville2 = [];
    $scope.ville_id = $routeParams.id;
    var initDB = function () {
        $scope.db = $webSql.openDatabase('Voltalis', '1.0', 'database', 2000000);

        $scope.db.createTable('villes', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL",
                "primary": true,
                "auto_increment": true
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP"
            },
            "Commune": {
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "Codepos": {
                "type": "TEXT",
                "null": "NOT NULL"
            }
        });
    };


    initDB();
    var ville_id = $routeParams.id;

    $scope.db.select("villes", {
        "id": {
            "value": ville_id
        }
    }).then(function (results) {


        for (var i = 0; i < results.rows.length; i++) {
            $scope.ville2.push(results.rows.item(i));
        }
        $scope.ville = angular.copy($scope.ville2[0]);


    });


    $scope.retourvilles = function () {

        var earl = '/villes/';
        $location.path(earl);

    };

    $scope.annuler = function () {

        $scope.ville = angular.copy($scope.ville2[0]);

        $scope.retourvilles();

// var earl = '/adresses/';
//     $location.path(earl);
    };


    $scope.update = function (ville) {
        initDB();
        var settings = $.extend({}, $scope.defaultville[0], ville);

        var Commune = settings.Commune;
        var Codepos = settings.Codepos;


        $scope.db.update('villes', {
            "Commune": Commune, "Codepos": Codepos


        }, {"id": $scope.ville_id});
        $scope.retourvilles();
    };


    //$scope.ville = UserService.model.ville;
    $scope.model = UserService.model;
    $scope.logout = function () {
        loginService.logout();
    };


}]);



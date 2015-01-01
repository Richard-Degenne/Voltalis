'use strict';

var app = angular.module('myApp', ['ngRoute','ngTouch', 'angular-websql']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'});
    $routeProvider.when('/villes', {templateUrl: 'partials/ville.html', controller: 'VilleController'});
    $routeProvider.when('/ville/:id', {templateUrl: 'partials/editville.html', controller: 'EditvilleController'});
    $routeProvider.when('/rues/:id', {templateUrl: 'partials/rues.html', controller: 'RueController'});
    $routeProvider.when('/rue/:id', {templateUrl: 'partials/editrue.html', controller: 'EditrueController'});
    $routeProvider.when('/export', {templateUrl: 'partials/export.html', controller: 'ExportController'});
    $routeProvider.when('/adresses', {templateUrl: 'partials/adresses.html', controller: 'AdresseController'});
    $routeProvider.when('/adresses/add', {templateUrl: 'partials/addadresse.html', controller: 'AdresseController'});
    $routeProvider.when('/adresse/:id', {templateUrl: 'partials/editadresse.html', controller: 'EditadresseController' });
    $routeProvider.otherwise({redirectTo: '/login'});
}]);

app.factory('UserService', function () {
    return {
        model: {
            "ville": "",
            "rue": "",
            "adresse": {
                "numero": 0,
                "doublon": 0,
                "collectif": false,
                "batiment": "",
                "digicode": "",
                "etage": "",
                "appartement": "",
                "statut": "",
                "commentaire": ""
            }
        }
    };
});

//app.controller('navctrl', ['loginService', function navctrl($scope) {
//    $scope.menu = 'home'
//}]);

app.run(function ($rootScope, $location, loginService) {

    var routespermission = ['/home',
        '/villes',
        '/ville/:id',
        '/rues/',
        '/rues/:id',
        '/adresses',
        '/adresses/add',
        '/adresses/:id',
        '/export'];  // les routes qui require le login
    $rootScope.$on('$routeChangeStart', function () {
        if (routespermission.indexOf($location.path()) != -1 && !loginService.islogged()) {
            $location.path('/login');
        }
    });
});
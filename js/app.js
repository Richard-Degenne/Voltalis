'use strict';
// Declare app level module which depends on filters, and services
var app= angular.module('myApp', ['ngRoute','ionic','angular-websql']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'loginCtrl'});
  $routeProvider.when('/villes', {templateUrl: 'partials/city.html', controller: 'villeCtrl'});
  $routeProvider.when('/ville/:id', {templateUrl: 'partials/editville.html', controller: 'editvilleCtrl'});
  $routeProvider.when('/rues/:id', {templateUrl: 'partials/rues.html', controller: 'rueCtrl'});
  $routeProvider.when('/rue/:id', {templateUrl: 'partials/editrue.html', controller: 'editrueCtrl'});
  $routeProvider.when('/export', {templateUrl: 'partials/export.html', controller: 'exportCtrl'});
  $routeProvider.when('/adresses', {templateUrl: 'partials/adresses.html', controller: 'adresseCtrl'});
  $routeProvider.when('/adresses/add', {templateUrl: 'partials/addadresse.html', controller: 'adresseCtrl'});
  $routeProvider.when('/adresse/:id', {templateUrl: 'partials/editadresse.html', controller: 'editadresseCtrl'});
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'homeCtrl'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);

app.factory('UserService', function() {
  return {
      model : {
    "ville" : "",
    "rue": "",
    "adresse": {
      "numero" : 0,
      "doublon" : 0,
      "collectif" : false,
      "batiment" : "",
      "digicode" : "",
      "etage" : "",
      "appartement" : "",
      "statut" : "",
      "commentaire" : "",
      }
}
  };
});



app.controller('navctrl', ['loginService', function navctrl($scope){
  $scope.menu = 'home'
}]);

app.run(function($rootScope, $location, loginService){

  var routespermission=['/home',
      '/villes',
      '/ville/:id',
      '/rues/',
      '/rues/:id',
      '/adresses',
      '/adresses/add',
      '/adresses/:id',
      '/export'];  // les routes qui require le login
	$rootScope.$on('$routeChangeStart', function(){
		if( routespermission.indexOf($location.path()) !=-1 && !loginService.islogged())
		{
			
				$location.path('/login');
		 
			
			
				 
		}
	});
});
'use strict';

app.controller('LoginController', ['$scope', 'loginService', function ($scope, loginService) {
    $scope.msgtxt = '';
    $scope.login = function (data) {
        loginService.login(data, $scope); //call login service
    };
}]);
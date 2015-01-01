'use strict';

app.controller('RueController', ['$scope', '$routeParams', 'loginService', 'UserService', 'LocalStorage', '$webSql', '$location', function ($scope, $routeParams, loginService, UserService, LocalStorage, $webSql, $location) {

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

    var ville_id = $routeParams.id;
    UserService.model.ville = ville_id;
    $scope.db.select("rues", {
        "ville": {
            "value": ville_id
        }
    }).then(function (results) {
        $scope.rues = [];

        for (var i = 0; i < results.rows.length; i++) {
            $scope.rues.push(results.rows.item(i));
        }

    });


    $scope.search = "";
    $scope.createville = false;
    $scope.rue = UserService.model.rue;
    $scope.model = UserService.model;
    $scope.logout = function () {
        loginService.logout();
    };


    $scope.DropDB = function () {
        var db = openDatabase('Voltalis', '1.0', 'database', 2000000);
        db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS rues');
        });
        $scope.rues = [];
    };


    var getRues = function () {

        initDB();
        $scope.db.select("rues", {
            "ville": {
                "value": UserService.model.ville
            }
        }).then(function (results) {
            $scope.rues = [];
            for (var i = 0; i < results.rows.length; i++) {
                $scope.rues.push(results.rows.item(i));
            }
        });

        // ($.get( "data/light.json", function( data ) {
        // 		var results= [];

        // 				for (var i=0 ; i < data.length ; i++)
        // 				{


        // 				       results.push(data[i]);

        // 				 }
        // 				return results;
        // 		  }));


// ///
// var result = [];
// var db = openDatabase('Voltalis', '1.0', 'database', 2000000);
// db.transaction(function (tx) {
// 	//tx.executeSql('CREATE TABLE IF NOT EXISTS villes (id INTEGER PRIMARY KEY, Commune, Codepos)');
// //populate drop down for unites

//     tx.executeSql('SELECT * FROM villes', [], function (tx, results) {
//         var len = results.rows.length; 
//         var i=0;
//         var txt="";
//         for (i = 0; i < len; i++){

//      result.push(results.rows.item(i));

//         }
//      }, null);
//    });

// return result;
// ///

        // var db = openDatabase('Voltalis', '1.0', 'database', 2000000);
        //  db.transaction(function(tx) {
        //  	tx.executeSql('CREATE TABLE IF NOT EXISTS villes (id unique, Commune, Codepos)');
        //    tx.executeSql('SELECT ALL FROM villes');
        //  });


    };

// $scope.villes = getVilles();

    $scope.addrue = function (value) {
        //$scope.villes.push(value);
        $scope.model.rue = value.id;

        //value.Codepos = prompt("postalcode ? ", "");

        $scope.db.insert('rues', {"nom": value.nom, "ville": UserService.model.ville}).then(function (results) {

            value.id = results.insertId;
        });

        // var db = openDatabase('Voltalis', '1.0', 'database', 2000000);
        //  db.transaction(function(tx) {
        //    tx.executeSql('INSERT INTO villes (Commune, Codepos) VALUES (?, ?)',[value.Commune,value.Codepos]);
        //  });
        $scope.rues.push(value);
        $scope.newTodo = null;

        // City.save(value).then(function (city) {
        //     $scope.$apply(function () {
        //         $scope.newTodo.Commune = null;
        //         $scope.villes.push(city);
        //     });
        // });


    };


    $scope.editrue = function (id) {
        var earl = '/rue/' + id;
        $location.path(earl);
    };


// remove une ville 
    $scope.removerue = function (id) {
        var confirmation = confirm("Êtes-vous sûr?");
        if (confirmation == true) {

            var removeByAttr = function (arr, attr, value) {
                var i = arr.length;
                while (i--) {
                    if (arr[i]
                        && arr[i].hasOwnProperty(attr)
                        && (arguments.length > 2 && arr[i][attr] === value )) {

                        arr.splice(i, 1);

                    }
                }
                return arr;
            };

            $scope.db.del("rues", {"id": id});
            removeByAttr($scope.rues, 'id', id);
        }
    };
///


    $scope.selectrue = function (value) {
        UserService.model.rue = value;
        var earl = '/adresses';
        $location.path(earl);


    };


    $scope.rechercher = function () {

        var results = [];


        var beginsWith = function (needle, haystack) {
            return (haystack.substr(0, needle.length) == needle.toUpperCase());
        };


        var searchField = "nom";
        var searchVal = $scope.search;
        for (var i = 0; i < $scope.rues.length; i++) {

            if (beginsWith(searchVal, $scope.rues[i][searchField])) {
                results.push($scope.rues[i]);

            } else {
                $scope.createrue = true;
                results = [];
            }
        }
        return results;

    };


    $scope.rues = getRues();


}]);



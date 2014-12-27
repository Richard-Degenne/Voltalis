'use strict';

app.controller('villeCtrl', ['$scope','$routeParams','loginService','UserService','LocalStorage','$webSql','$location', function($scope,$routeParams,loginService,UserService,LocalStorage,$webSql,$location){
	//$scope.txt='Page ville';
	
	// $scope.villes = [{
 //    "Commune":"Paris",
 //    "Codepos":"64460"
 //  },
 //  {
 //    "Commune":"Lens",
 //    "Codepos":"55130"
 //  },
 //  {
 //    "Commune":"Lion",
 //    "Codepos":"59265"
 //  }];

// var City = $data.define("City", {
//             Commune: String,
//             Codepos: String
//         });

$scope.initDB = function(){
  $scope.db = $webSql.openDatabase('Voltalis', '1.0', 'database', 2000000); 

$scope.db.createTable('villes', {
  "id":{
    "type": "INTEGER",
    "null": "NOT NULL", // default is "NULL" (if not defined)
    "primary": true, // primary
    "auto_increment": true // auto increment
  },
  "created":{
    "type": "TIMESTAMP",
    "null": "NOT NULL",
    "default": "CURRENT_TIMESTAMP" // default value
  },
  "Commune":{
    "type": "TEXT",
    "null": "NOT NULL"
  },
  "Codepos": {
    "type": "TEXT",
    "null": "NOT NULL"
  }
});
}




  

	$scope.villes = [];
	$scope.search = "";
  	$scope.createville = false;
	$scope.ville = UserService.model.ville;
	$scope.model = UserService.model;
	$scope.logout=function(){
		loginService.logout();
	};





$scope.DropDB = function(){
  var db = openDatabase('Voltalis', '1.0', 'database', 2000000);
  db.transaction(function(tx) {
   tx.executeSql('DROP TABLE IF EXISTS villes');
  });
  $scope.villes = [];
};


var getVilles = function(){

$scope.initDB();
$scope.db.selectAll("villes").then(function(results) {
  $scope.villes = [];
  for(var i=0; i < results.rows.length; i++){
    $scope.villes.push(results.rows.item(i));
  }
})

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


}


    $scope.addville= function(value){

	$scope.model.ville = value.Commune;
	value.Codepos = prompt("N° de département :", "");

    if (value.Codepos === "" || value.Codepos === null ) {
        // do nothing
    }else{
        $scope.db.insert('villes', {"Commune": value.Commune, "Codepos": value.Codepos}).then(function(results) {
            console.log(results.insertId);
            value.id=results.insertId;
        });

        $scope.villes.push(value);
        $scope.newTodo = null;
    }

};


$scope.editville = function(id){
    var earl = '/ville/' + id;
    $location.path(earl);
}


    // remove une ville
    $scope.removeville= function(id){
     var confirmation = confirm("Êtes-vous sûr?");
    if (confirmation == true ) {

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

        $scope.db.del("villes", {"id": id});
        removeByAttr($scope.villes, 'id', id);

    }else {
    // do nothing
    }
};



$scope.selectville= function(id){
    UserService.model.ville = id;
    var earl = '/rues/' + id;
    $location.path(earl);
	  

}


	$scope.rechercher = function(){
		console.log('rechercher');
			var results = [];


			var beginsWith = function(needle, haystack){
		    return (haystack.substr(0, needle.length) == needle.toUpperCase());
			};


			var searchField = "Commune";
			var searchVal = $scope.search;
					for (var i=0 ; i < $scope.villes.length ; i++)
					{

					    if (beginsWith(searchVal,$scope.villes[i][searchField])) {
					        results.push($scope.villes[i]);
					        					     
					    }else{
					    	$scope.createville = true;
					    	results = [];
					    }
 				 }
return results;

	};




	//console.log($scope.villes);
	
 $scope.villes = getVilles();
	

}])



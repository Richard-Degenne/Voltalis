'use strict';


app.controller('editrueCtrl', ['$scope','$routeParams','loginService','UserService','LocalStorage','$webSql','$location', function($scope,$routeParams,loginService,UserService,LocalStorage,$webSql,$location){
	//$scope.txt='Page ville';

	//console.log($scope.ville_id);
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
 $scope.rue = [];
   $scope.defaultrue = [{
          nom: ''
          

  }];



 $scope.rue2 = [];
 $scope.rue_id = $routeParams.id;
var initDB = function(){
  $scope.db = $webSql.openDatabase('Voltalis', '1.0', 'database', 2000000); 

$scope.db.createTable('rues', {
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
  "nom":{
    "type": "TEXT",
    "null": "NOT NULL"
  },
  "ville": {
    "type": "INTEGER",
    "null": "NOT NULL"
  }
});
}


initDB();
	var rue_id = $routeParams.id;

	$scope.db.select("rues", {
  "id": {
    "value": rue_id
  }
}).then(function(results) {
 
  
  for(var i=0; i < results.rows.length; i++){
    $scope.rue2.push(results.rows.item(i));
  }
  $scope.rue = angular.copy($scope.rue2[0]);
  

})


$scope.retourrues= function(ville){

var earl = '/rues/' + ville;
    $location.path(earl);

}

$scope.annuler= function(){
  
 $scope.rue = angular.copy($scope.rue2[0]);

$scope.retourrues($scope.rue.ville);

// var earl = '/adresses/';
//     $location.path(earl);
}


$scope.update= function(rue){
  initDB();
var settings = $.extend({}, $scope.defaultrue[0], rue);
console.log(settings);
  var nom = settings.nom;

  

  



  // complement = (complement == undefined) ? NULL : complement ;
  // collectif = (collectif == undefined) ? 'false' : complement ;
  // batiment=(batiment == undefined) ? NULL : batiment ;
  // digicode=(digicode == undefined) ? NULL : digicode ;
  // etage=(etage == undefined) ? NULL : etage ;
  // appartement=(appartement == undefined) ? NULL : appartement ;
  // statut=(statut == undefined) ? NULL : statut ;
  // commentaire = (commentaire == undefined) ? NULL : commentaire ;

  //value.Codepos = prompt("postalcode ? ", "");

$scope.db.update('rues', {"nom": nom
      
      
      },{"id" : $scope.rue_id });
 $scope.retourrues();
}



	//$scope.ville = UserService.model.ville;
	$scope.model = UserService.model;
	$scope.logout=function(){
		loginService.logout();
	};





	

}])



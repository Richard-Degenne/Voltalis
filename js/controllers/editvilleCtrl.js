'use strict';


app.controller('editvilleCtrl', ['$scope','$routeParams','loginService','UserService','LocalStorage','$webSql','$location', function($scope,$routeParams,loginService,UserService,LocalStorage,$webSql,$location){
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
 $scope.ville = [];
   $scope.defaultville = [{
          Commune : '',
          Codepos : '',
          

  }];



 $scope.ville2 = [];
 $scope.ville_id = $routeParams.id;
var initDB = function(){
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



initDB();
  var ville_id = $routeParams.id;

  $scope.db.select("villes", {
  "id": {
    "value": ville_id
  }
}).then(function(results) {
 
  
  for(var i=0; i < results.rows.length; i++){
    $scope.ville2.push(results.rows.item(i));
  }
  $scope.ville = angular.copy($scope.ville2[0]);
  

})


$scope.retourvilles= function(){
  
var earl = '/villes/';
    $location.path(earl);

}

$scope.annuler= function(){
  
 $scope.ville = angular.copy($scope.ville2[0]);

$scope.retourvilles();

// var earl = '/adresses/';
//     $location.path(earl);
}


$scope.update= function(ville){
  initDB();
var settings = $.extend({}, $scope.defaultville[0], ville);
console.log(settings);
  var Commune = settings.Commune;
  var Codepos = settings.Codepos;

  

  



  // complement = (complement == undefined) ? NULL : complement ;
  // collectif = (collectif == undefined) ? 'false' : complement ;
  // batiment=(batiment == undefined) ? NULL : batiment ;
  // digicode=(digicode == undefined) ? NULL : digicode ;
  // etage=(etage == undefined) ? NULL : etage ;
  // appartement=(appartement == undefined) ? NULL : appartement ;
  // statut=(statut == undefined) ? NULL : statut ;
  // commentaire = (commentaire == undefined) ? NULL : commentaire ;

  //value.Codepos = prompt("postalcode ? ", "");

$scope.db.update('villes', {"Commune": Commune,"Codepos":Codepos
      
      
      },{"id" : $scope.ville_id });
 $scope.retourvilles();
}



  //$scope.ville = UserService.model.ville;
  $scope.model = UserService.model;
  $scope.logout=function(){
    loginService.logout();
  };





  

}])



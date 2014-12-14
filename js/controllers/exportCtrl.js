app.factory('cordovaReady', function() {
  return function (fn) {

    var queue = [];

    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };
    document.addEventListener('deviceready', function () {
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);

    return function () {
      return impl.apply(this, arguments);
    };
  };
});


// app.factory('exported', function ($rootScope, cordovaReady) {
//   return {
//     exporte: cordovaReady(function (onSuccess, onError, options) {
//       navigator.exported.exporte(function () {
//        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(){
//           console.log("yes!");
//        });

//         var that = this,
//           args = arguments;

//         if (onSuccess) {
//           $rootScope.$apply(function () {
//             onSuccess.apply(that, args);
//           });
//         }
//       }, function () {
//         var that = this,
//           args = arguments;

//         if (onError) {
//           $rootScope.$apply(function () {
//             onError.apply(that, args);
//           });
//         }
//       },
//       options);
//     })
//   };
// });

app.controller('exportCtrl', ['$scope','$routeParams','loginService','UserService','LocalStorage','$webSql','$location','cordovaReady', function($scope,$routeParams,loginService,UserService,LocalStorage,$webSql,$location,cordovaReady){



 $scope.result = " ";
var ville = " ";
 $scope.rue= " ";
 $scope.rues = [];
 $scope.exporte = [{
    debut : '',
    fin : ''
 }];
 $scope.villes = [];
 $scope.adresses = [];



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

$scope.db.createTable('adresses', {
  "id":{
    "type": "INTEGER",
    "null": "NOT NULL", // default is "NULL" (if not defined)
    "primary": true, // primary
    "auto_increment": true // auto increment
  },
   "numero":{
    "type": "INTEGER",
    "null": "NOT NULL"
  },
  "doublon":{
    "type": "STRING"
  },
  "uid":{
    "type": "INTEGER"
  },
  "complement":{
    "type": "STRING",
    "default": ''
  },
  "collectif":{
    "type": "BOOLEAN",
    "default": false
  },
  "batiment":{
    "type": "STRING",
    "default": ''
  },
  "digicode":{
    "type": "INTEGER",
    "default": ''
  },
  "etage":{
    "type": "STRING",
    "default": ''
  },
  "appartement":{
    "type": "STRING",
    "default": ''
  },
  "statut":{
    "type": "INTEGER"
  },
  "commentaire":{
    "type": "STRING"
  },
  "ville_id": {
    "type": "INTEGER",
    "null": "NOT NULL"
  },
  "rue_id": {
    "type": "INTEGER",
    "null": "NOT NULL"
  },
  "created":{
    "type": "TIMESTAMP",
    "null": "NOT NULL",
    "default": "CURRENT_TIMESTAMP" // default value
  }
});




}


$scope.initDB();
  var adresse_id = $routeParams.id;

  $scope.db.select("adresses", {
  "id": {
    "value": adresse_id
  }
}).then(function(results) {
 
  
  for(var i=0; i < results.rows.length; i++){
    $scope.adresse2.push(results.rows.item(i));
  }
  $scope.adresse = angular.copy($scope.adresse2[0]);

})






$scope.exporting= function(){
  var debut = String($scope.exporte.debut);
  var fin = String($scope.exporte.fin);
  var file_name = debut +"_"+ fin + ".csv";
$scope.initDB();
$scope.db.exporte("adresses","created", $scope.exporte.debut ,$scope.exporte.fin).then(function(results) {
  $scope.adresses = [];
  for(i=0; i < results.rows.length; i++){
    $scope.adresses.push(results.rows.item(i));
  
  }

var  statuts = {
    20  : "Statut logement",
    0 : "Absent Elec",
    1 : "Rendez-vous pris",
    2 : "À recontacter",
    3 : "Ko Adhérent",
    4 : "Déjà installé",
    5 : "Refus argumenté",
    6 : "Refus de dialogue",
    7 : "Refus locataire",
    8 : "Bailleur non autorisé",
    9 : "GPRS NOK",
    10  : "Vétusté",
    11  : "Puissance trop faible",
    12  : "Convecteur inéligible",
    13  : "Chauffage électrique collectif",
    14  : "PAC",
    15  : "Manque de place dans Tableau",
    16  : "Tableau en hauteur",
    17  : "Zone encombrée",
    18  : "Absent/Energie inconnue",
    19  : "Logement non-électrique",
    };

var parsed = JSON.parse(JSON.stringify($scope.adresses), function(Statut, v) {
    if (Statut === "statut") {
      this.Statut = statuts[this[Statut]];
    }
    else
        return v;
});





 

  //FILES MANAGEMENT:
  //
 

$scope.resuting = Papa.unparse(JSON.stringify(parsed),{
  delimiter: ";",
});



cordovaReady(window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(fileSystem){
  console.log(JSON.stringify(fileSystem));
           fileSystem.getFile(file_name, {create: true, exclusive: false}, function(fileEntry){

                  fileEntry.createWriter(function(writer){
                    writer.onwrite = function(evt) {
                    
                  };
                  writer.write($scope.resuting);
                  $scope.csv = "fichier exporté avec succes !";
                })


           })
       })
);





});



}


$scope.retourville= function(){
var earl = '/villes/';
    $location.path(earl);

}

$scope.annuler= function(){

 $scope.retourville();
}




  //$scope.ville = UserService.model.ville;
  $scope.model = UserService.model;
  $scope.logout=function(){
    loginService.logout();
  };





  

}])



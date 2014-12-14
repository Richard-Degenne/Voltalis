'use strict';


app.filter('affichage', function() {
   return function(collection) {
   var  keyname = 'uid';
      var output = [], 
          keys = [];
          if (collection == undefined){


          }else{

        collection.reverse();
          }
      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});

app.filter('ladresse', function() {
   return function(adresse) {
    var titre = "";

    if (adresse.collectif == "true"){
      titre = "Bat "+ adresse.batiment + " Etage " + adresse.etage + " Apt " + adresse.appartement;
      
    }else{
      if ((adresse.doublon === "non") || (adresse.doublon == 0 ) ){
        titre = adresse.numero  + " "+  adresse.complement;
      }else {
        titre = adresse.numero + " "+ adresse.doublon + " "+ adresse.complement;
      }
      
    }
    

      return titre;
   };
});


app.controller('adresseCtrl', ['$scope','$routeParams','loginService','UserService','LocalStorage','$webSql','$location', function($scope,$routeParams,loginService,UserService,LocalStorage,$webSql,$location){

$scope.adresses = [];
$scope.getClass = function getClass(statut) {
  statut = parseInt(statut);
  return {
    'entry entryName': (statut == 1) || (statut == 4),
    'entry entryName orange': (statut == 18) || (statut == 0) || (statut == 2),
    'entry entryName red': (statut != 1) & (statut != 4) & (statut != 18) & (statut != 0) & (statut != 2) 
  };
};

var initDB = function(){
  $scope.db = $webSql.openDatabase('Voltalis', '1.0', 'database', 2000000); 


  
 
$scope.db.createTable('adresses', {
  "id":{
    "type": "INTEGER",
    "null": "NOT NULL", // default is "NULL" (if not defined)
    "primary": true, // primary
    "auto_increment": true // auto increment
  },
   "numero":{
    "type": "INTEGER",
  },
  "doublon":{
    "type": "INTEGER"
  },
  "uid":{
    "type": "INTEGER"
  },
  "complement":{
    "type": "STRING",
  },
  "collectif":{
    "type": "boolean", 
    "default": 0,
  },
  "batiment":{
    "type": "STRING",
  },
  "digicode":{
    "type": "INTEGER",
  },
  "etage":{
    "type": "STRING",
  },
  "appartement":{
    "type": "STRING",
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


initDB();
  
 
$scope.retourrue= function(){
var ville_id = UserService.model.ville;
var earl = '/rues/'+ ville_id;
    $location.path(earl);

}




  if(!$routeParams.id === "undefined"){
  var rue_id = $routeParams.id;
  UserService.model.rue = rue_id ;

 

  $scope.db.select("adresses", {
  "rue_id": {
    "value":rue_id
  }
}).then(function(results) {
 $scope.adresses = [];
console.log($scope.adresses);
  for(var i=0; i < results.rows.length; i++){
    $scope.adresses.push(results.rows.item(i));
  }
 // console.log($scope.adresses);
});

 }

	$scope.search = "";
  $scope.createadresse = false;
  $scope.adresse= [];
  $scope.defaultadresse = [{
          appartement: "",
          batiment: "",
          collectif: false,
          commentaire: "",
          complement: "",
          created: "",
          digicode: "",
          doublon: 0,
          etage: '',
          numero: '',
          rue_id: '',
          statut: 0,
          ville_id: ''

  }];
	//$scope.adresse = UserService.model.adresse;
	$scope.model = UserService.model;
	$scope.logout=function(){
		loginService.logout();
	};





$scope.DropDB = function(){
  var db = openDatabase('Voltalis', '1.0', 'database', 2000000);
  db.transaction(function(tx) {
   tx.executeSql('DROP TABLE IF EXISTS adresses');
  });
  $scope.adresses = [];
};


var getadresses = function(){

initDB();
$scope.db.select("adresses", {
  "rue_id": {
    "value":UserService.model.rue
  }
}).then(function(results) {
  $scope.adresses = [];
  for(var i=0; i < results.rows.length; i++){
    $scope.adresses.push(results.rows.item(i));
  }
})


}

$scope.createadresse= function(){
console.log('clicked');
var earl = '/adresses/add';
    $location.path(earl);

}

$scope.checkbis = function(e){
  if(e == true){
    $scope.adresse.ter = false;
  }
  console.log(UserService.model);
}

$scope.checkter = function(e){
  if(e == true){
    $scope.adresse.bis = false;
  }
}

$scope.annuler= function(){

var earl = '/adresses/';
    $location.path(earl);

}



// $scope.villes = getVilles();


function getUID() {
var dNow = new Date();
var s = dNow.getMonth() + '/' + dNow.getDate() + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes()+ ':' + dNow.getSeconds();
return CryptoJS.MD5(s).toString();
}


$scope.saveandstay= function(adresse){
  initDB();
var settings = $.extend({}, $scope.defaultadresse[0], adresse);
console.log(settings);
  var ville_id = UserService.model.ville;
  var rue_id = UserService.model.rue;
  var uid = getUID();
  var numero = settings.numero;
  var bis = settings.bis;
  var ter = settings.ter;
  var complement = settings.complement;
  var collectif = settings.collectif;
  var batiment = settings.batiment;
  var digicode = settings.digicode;
  var etage = settings.etage;
  var appartement = settings.appartement;
  var statut = settings.statut;
  var commentaire = settings.commentaire;
  var doublon = 0;

  if(bis === true){
      doublon = 1;
  }else if(ter === true){
      doublon = 2;
  }



  // complement = (complement == undefined) ? NULL : complement ;
  // collectif = (collectif == undefined) ? 'false' : complement ;
  // batiment=(batiment == undefined) ? NULL : batiment ;
  // digicode=(digicode == undefined) ? NULL : digicode ;
  // etage=(etage == undefined) ? NULL : etage ;
  // appartement=(appartement == undefined) ? NULL : appartement ;
  // statut=(statut == undefined) ? NULL : statut ;
  // commentaire = (commentaire == undefined) ? NULL : commentaire ;
	//value.Codepos = prompt("postalcode ? ", "");

$scope.db.insert('adresses', {"numero": numero,
      "uid": uid,
      "doublon": doublon,
      "complement": complement,
      "collectif": collectif,
      "batiment": batiment,
      "digicode": digicode,
      "etage": etage,
      "statut": statut,
      "appartement": appartement,
      "commentaire": commentaire,
      "rue_id": rue_id,
     "ville_id": ville_id}).then(function(results) {
  console.log(results.insertId);
 
});

 // var db = openDatabase('Voltalis', '1.0', 'database', 2000000);
 //  db.transaction(function(tx) {
 //    tx.executeSql('INSERT INTO villes (Commune, Codepos) VALUES (?, ?)',[value.Commune,value.Codepos]);
 //  });
         // $scope.adresses.push(settings);
          //$scope.adresse = null;
          
            // City.save(value).then(function (city) {
            //     $scope.$apply(function () {
            //         $scope.newTodo.Commune = null;
            //         $scope.villes.push(city);
            //     });
            // });
       


}

$scope.saveandgoback= function(adresse){
// var earl = '/adresses/';
//     $location.path(earl);
$scope.saveandstay(adresse);
var earl = '/adresses/';
    $location.path(earl);
}

$scope.editadresse = function(id){
    var earl = '/adresse/' + id;
    $location.path(earl);
}


// remove une ville 
$scope.removeadresse= function(id){

	var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}

	console.log(id);
$scope.db.del("adresses", {"id": id});
          
            // City.save(value).then(function (city) {
            //     $scope.$apply(function () {
            //         $scope.newTodo.Commune = null;
            //         $scope.villes.push(city);
            //     });
            // });
       //$scope.villes = getVilles();
   //    $rootscope.apply();
removeByAttr($scope.adresses, 'id', id);
//getVilles();
}
///


$scope.selectadresse= function(value){
    UserService.model.adresse = value;
    var earl = '/adresse/' + value;
    $location.path(earl);
	  

}


	$scope.rechercher = function(){
		console.log('rechercher');
			var results = [];


			var beginsWith = function(needle, haystack){
		    return (haystack.substr(0, needle.length) == needle.toUpperCase());
			};


			var searchField = "nom";
			var searchVal = $scope.search;
					for (var i=0 ; i < $scope.adresses.length ; i++)
					{

					    if (beginsWith(searchVal,$scope.adresses[i][searchField])) {
					        results.push($scope.adresses[i]);
					        					     
					    }else{
					    	$scope.createadresse = true;
					    	results = [];
					    }
 				 }
return results;

	};




	//console.log($scope.villes);
	
 $scope.adresses = getadresses();
	

}])



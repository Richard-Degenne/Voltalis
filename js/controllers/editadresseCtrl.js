'use strict';

app.filter('Statut', function () {
    return function (statut) {
        var statuts = [{
            "0": "Absent Elec",
            "1": "Rendez-vous pris",
            "2": "À recontacter",
            "3": "Ko Adhérent",
            "4": "Déjà installé",
            "5": "Refus argumenté",
            "6": "Refus de dialogue",
            "7": "Refus locataire",
            "8": "Bailleur non autorisé",
            "9": "GPRS NOK",
            "10": "Vétusté",
            "11": "Puissance trop faible",
            "12": "Convecteur inéligible",
            "13": "Chauffage électrique collectif",
            "14": "PAC",
            "15": "Manque de place dans Tableau",
            "16": "Tableau en hauteur",
            "17": "Zone encombrée",
            "18": "Absent/Energie inconnue",
            "19": "Logement non-électrique",
            "20": "Statut logement"
        }];


        return statuts[0][statut];
    }
});

app.filter('doublon', function () {
    return function (doublon) {
        var reponse = '';
        if (doublon === 'bis') {
            reponse = 'Bis';
        } else {
            if (doublon === 'ter') {
                reponse = 'Ter';
            } else {
                reponse = 'Non';

            }
        }

        return reponse;
    }
});


app.controller('EditadresseController', ['$scope', '$routeParams', 'loginService', 'UserService', 'LocalStorage', '$webSql', '$location', function ($scope, $routeParams, loginService, UserService, LocalStorage, $webSql, $location) {

    $scope.adresse = [];
    $scope.defaultadresse = [{
        appartement: '',
        batiment: '',
        collectif: '',
        commentaire: '',
        complement: '',
        digicode: "",
        doublon: 'non',
        etage: "",
        numero: '',
        statut: 0

    }];


    $scope.adresse2 = [];
    $scope.newadresse = [];
    $scope.modeEdit = true;
    $scope.adresse_id = $routeParams.id;
    var initDB = function () {
        $scope.db = $webSql.openDatabase('Voltalis', '1.0', 'database', 2000000);

        $scope.db.createTable('adresses', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL",
                "primary": true,
                "auto_increment": true
            },
            "numero": {
                "type": "INTEGER"
            },
            "uid": {
                "type": "INTEGER"
            },
            "doublon": {
                "type": "STRING"
            },
            "complement": {
                "type": "STRING",
                "default": ''
            },
            "collectif": {
                "type": "BOOLEAN",
                "default": false
            },
            "batiment": {
                "type": "STRING",
                "default": ''
            },
            "digicode": {
                "type": "STRING",
                "default": ''
            },
            "etage": {
                "type": "STRING",
                "default": ''
            },
            "appartement": {
                "type": "STRING",
                "default": ''
            },
            "statut": {
                "type": "INTEGER"
            },
            "commentaire": {
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
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            }
        });
    };


    initDB();
    var adresse_id = $routeParams.id;

    $scope.db.select("adresses", {
        "id": {
            "value": adresse_id
        }
    }).then(function (results) {


        for (var i = 0; i < results.rows.length; i++) {
            $scope.adresse2.push(results.rows.item(i));
        }
        $scope.adresse = angular.copy($scope.adresse2[0]);


    });


    $scope.retouradresse = function () {
        var earl = '/adresses/';
        $location.path(earl);

    };

    $scope.annuler = function () {

        $scope.adresse = angular.copy($scope.adresse2[0]);


        $scope.modeEdit = false;

    };


    $scope.update = function (adresse) {
        initDB();
        var settings = $.extend({}, $scope.defaultadresse[0], adresse);
        var ville_id = UserService.model.ville;
        var rue_id = UserService.model.rue;
        var numero = settings.numero;
        var uid = settings.uid;
        var doublon = settings.doublon;
        var complement = settings.complement;
        var collectif = settings.collectif;
        var batiment = settings.batiment;
        var digicode = settings.digicode;
        var etage = settings.etage;
        var appartement = settings.appartement;
        var statut = settings.statut;
        var commentaire = settings.commentaire;


        $scope.db.insert('adresses', {
            "uid": uid,
            "numero": numero,
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
            "ville_id": ville_id
        }).then(function (results) {
            alert('Le logement est mis à jour');

        });
        $scope.modeEdit = false;

    };


    $scope.model = UserService.model;
    $scope.logout = function () {
        loginService.logout();
    };

}]);
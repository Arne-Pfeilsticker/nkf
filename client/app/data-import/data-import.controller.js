(function () {
    'use strict';

    angular.module('nkfApp').controller('DataImportController', DataImportController);

    DataImportController.$inject = ['$state', '$q', 'ldbApi', 'nkfApi'];

    function DataImportController($state, $q, ldbApi, nkfApi) {
        /* jshint validthis: true */
        var vm = this;
        vm.importedData = '';
        //vm.notesCollapsed = true;
        //vm.navigate = navigate;
        vm.activate = activate;
        vm.personId = '05124000';
        vm.table = '71147GJ001';
        vm.bookingYear = '2010';
        vm.importDataJSON = '';

        //vm.table.select

        vm.tables = [
            {
                name: 'Aufwendungen',
                code: '71147EGJ02'
            },
            {
                name: 'Erträge',
                code: '71147EGJ01'
            },
            {
                name: 'Auszahlungen',
                code: '71147GJ002'
            },
            {
                name: 'Einzahlungen',
                code: '71147GJ001'
            }

        ];

        vm.gridOptions = {
            data: 'vm.importedData',
            enableGridMenu: true,
            enableSorting: true,
            enableFiltering: true,
            // showTreeExpandNoChildren: false, // This should suppress + sign for leaves.
            columnDefs: [
                {field: 'personId', displayName: 'Kennzahl', width: '*'},
                {field: 'productId', displayName: 'Produktgruppe', visible: true, width: '*'},
                {field: 'nkfAccount', displayName: 'Konto', width: '*'},
                {field: 'bookingYear', displayName: 'Jahr', width: '*'},
                {field: 'amount', displayName: 'Betrag', cellFilter: 'currency', cellClass: 'grid-align-right'}
            ],
            importerDataAddCallback: function (grid, newObjects) {
                vm.importedData = vm.importedData.concat(newObjects);
            }
        };

        activate();

        ////////////////

        function activate() {
            // console.log('current state data', $state.current.data);
        }

        vm.importData = function () {

            return $q.all([
                ldbApi.httpTableByGKZ(vm.table, vm.personId, vm.bookingYear)
                //eliteApi.getGames(leagueId),
                //eliteApi.getLocations()
            ]).then(function (results) {
                vm.importedData = results[0];
                console.log(vm.importedData[0]);
                console.log(vm.importedData[0].personId);
                vm.importDataJSON = angular.toJson(vm.importedData);
                console.log(vm.importDataJSON);
                //games: results[1],
                //locations: results[2]

            });
        };

        vm.values = [{"personId":"05124000","productId":"111","nkfAccount":"6","bookingYear":2010,"amount":46989779},{"personId":"05124000","productId":"111","nkfAccount":"6141","bookingYear":2010,"amount":69230},{"personId":"05124000","productId":"111","nkfAccount":"6146","bookingYear":2010,"amount":6000}];
        vm.importBookings = function(values) {
            nkfApi.importBookings(values)
                .then(function (results) {
                    console.log('Imported data', results);
                })
                .catch(function (err) {
                    console.log('Error Imported data', err);
                });
        };


    }
})();
(function () {
    'use strict';

    angular.module('nkfApp').controller('DataImportController', DataImportController);

    DataImportController.$inject = ['$state', '$q', 'ldbApi', 'nkfApi', '$interval'];

    function DataImportController($state, $q, ldbApi, nkfApi, $interval) {
        /* jshint validthis: true */
        var vm = this;
        vm.importedData = [];
        //vm.notesCollapsed = true;
        //vm.navigate = navigate;
        vm.activate = activate;
        vm.personId = '05111000';  // Düsseldorf
        vm.table = '71147GJ001';   // Einzahlungen
        vm.bookingYear = '2009';

        vm.loading = false;
        //vm.importDataJSON = '';

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
            enableCellEditOnFocus: true,
            // showTreeExpandNoChildren: false, // This should suppress + sign for leaves.
            columnDefs: [
                {field: 'personId', displayName: 'Kennzahl', type: 'string', width: '*'},
                {field: 'productId', displayName: 'Produktgruppe', type: 'string', visible: true, width: '*'},
                {field: 'nkfAccount', displayName: 'Konto', type: 'string', width: '*'},
                {field: 'bookingYear', displayName: 'Jahr', width: '*'},
                {field: 'amount', displayName: 'Betrag', cellTemplate: '<div class=\'ui-grid-cell-contents\' style=\'text-align: right\'>{{COL_FIELD  | currency:\'€\':0}}</div>' }
            ],
            importerDataAddCallback: function (grid, newObjects) {
                vm.importedData = vm.importedData.concat(newObjects);
            },
            onRegisterApi: function(gridApi){
                vm.gridApi = gridApi;
            }
        };

        activate();

        ////////////////

        function activate() {
            // console.log('current state data', $state.current.data);
        }

        vm.importData = function () {
            vm.loading = true;
            return $q.all([
                ldbApi.httpTableByGKZ(vm.table, vm.personId, vm.bookingYear)
                //eliteApi.getGames(leagueId),
                //eliteApi.getLocations()
            ]).then(function (results) {
                vm.importedData = results[0];
                vm.loading = false;
                //console.log(vm.importedData[0]);
                //console.log(vm.importedData[0].personId);
                //vm.importDataJSON = angular.toJson(vm.importedData);
                //console.log(vm.importDataJSON);
                //games: results[1],
                //locations: results[2]

            }).finally(function () {
                vm.loading = false;
            });
        };

        // vm.values = [{"personId":"05124000","productId":"111","nkfAccount":"6","bookingYear":2010,"amount":46989779},{"personId":"05124000","productId":"111","nkfAccount":"6141","bookingYear":2010,"amount":69230},{"personId":"05124000","productId":"111","nkfAccount":"6146","bookingYear":2010,"amount":6000}];
        vm.importBookings = function (values) {
            vm.loading = true;
            console.log(vm.importedData[0]);
            console.log(vm.importedData[0].personId);
            nkfApi.importBookings(values)
                .then(function (results) {
                    console.log('Imported data', results);
                })
                .catch(function (err) {
                    console.log('Error Imported data', err);
                })
                .finally(function () {
                    vm.loading = false;
                });
        };


    }
})();
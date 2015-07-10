(function () {
    'use strict';

    angular.module('nkfApp').controller('DataImportController', DataImportController);

    DataImportController.$inject = ['$state', '$q', 'ldbApi'];

    function DataImportController($state, $q, ldbApi) {
        /* jshint validthis: true */
        var vm = this;
        vm.importedData = '';
        //vm.notesCollapsed = true;
        //vm.navigate = navigate;
        vm.activate = activate;
        vm.gkz = '05124000';
        vm.table = '71147EGJ01';
        vm.year = '2010';

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
                {field: 'gkz', displayName: 'Kennzahl', width: '*'},
                {field: 'prodgr', displayName: 'Produktgruppe', visible: true, width: '*'},
                {field: 'account', displayName: 'Konto', width: '*'},
                {field: 'year', displayName: 'Jahr', width: '*'},
                {field: 'value', displayName: 'Betrag', cellFilter: 'currency', cellClass: 'grid-align-right'}
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

        vm.importData = function (){

            return $q.all([
                ldbApi.httpTableByGKZ(vm.table, vm.gkz, vm.year)
                //eliteApi.getGames(leagueId),
                //eliteApi.getLocations()
            ]).then(function(results){
                vm.importedData = results[0];
                    //games: results[1],
                    //locations: results[2]

            });
        };

    }
})();
(function () {
    'use strict';

    angular.module('nkfApp').controller('PersonTypesController', PersonTypesController);

    PersonTypesController.$inject = ['personTypes'];

    function PersonTypesController(personTypes) {
        /* jshint validthis: true */
        var vm = this;

        vm.activate = activate;

        vm.personTypes = personTypes;
        console.log(vm.personTypes);


        vm.gridOptions = {
            data:  'vm.personTypes',
            enableFiltering: true,
            enableSorting: true,
            enableGridMenu: true,
            columnDefs: [
                {field: 'id', displayName: 'Id', type: 'string', width: '*'},
                {field: 'parent_id', displayName: 'Id Oberbegriff', type: 'string', width: '*'},
                {field: 'label', displayName: 'Bezeichnung', type: 'string', width: '50%'},
                {field: 'acronym', displayName: 'Abk.', type: 'string', width: '*'}
            ],
            importerDataAddCallback: function (grid, newObjects) {
                vm.personTypes = vm.personTypes.concat(newObjects);
            },
            onRegisterApi: function(gridApi){
                vm.gridApi = gridApi;
            }

        };

        activate();

        ////////////////

        function activate() {

        }
    }
})();
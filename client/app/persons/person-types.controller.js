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
            enableGridMenu: true,
            columnDefs: [
                { name: 'id', field: 'id' },
                { name: 'parent_id', field: 'parent_id' },
                { name: 'label', field: 'label' }
            ],

            enableFiltering: true
        };

        activate();

        ////////////////

        function activate() {

        }
    }
})();
(function () {
    'use strict';

    angular.module('nkfApp').controller('PersonTypesCtrl', PersonTypesCtrl);

    PersonTypesCtrl.$inject = ['initialData'];
    /* @ngInject */
    function PersonTypesCtrl(initialData) {
        /* jshint validthis: true */
        var vm = this;

        vm.personTypes = initialData.result ;
        console.log(vm.personTypes);
        vm.activate = activate;

        // vm.importData = importData;
        vm.parsedData = [];

        vm.gridOptions = {
            data:  vm.personTypes ,
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
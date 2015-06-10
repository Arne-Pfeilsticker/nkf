(function () {
    'use strict';

    angular.module('nkfApp').controller('FrameworkController', FrameworkController);

    FrameworkController.$inject = ['framework'];

    function FrameworkController(framework) {
        /* jshint validthis: true */
        var vm = this;
        vm.framework = framework;

        vm.activate = activate;

        vm.gridOptions = {
            data: 'vm.framework',
            enableGridMenu: true,
            enableSorting: true,
            enableFiltering: true,
            showTreeExpandNoChildren: false,
            columnDefs: [
                {field: 'id', displayName: 'Konto', width: '*'},
                {field: 'parent_id', visible: false, width: '*'},
                {field: 'breakdown', displayName: 'Gliederung', visible: false, width: '*'},
                {field: 'sign', displayName: 'VZ', visible: false, width: '*'},
                {field: 'nkf_account', displayName: 'NKF-Konto', visible: false},
                {field: 'label', displayName: 'Bezeichnung', width: '70%'},
                {field: 'shortcut', displayName: 'Kurzbezeichnung', visible: false},
                {field: 'beneficiary', displayName: 'Leistungsempfänger', visible: false},
                {field: 'provider', displayName: 'Leister', visible: false},
                {field: '$$treeLevel', displayName: 'Ebene', width: '5%'}
            ],
            importerDataAddCallback: function(grid, newObjects){
                vm.framework = vm.framework.concat(newObjects);
            }
        };

        activate();

        ////////////////

        function activate() {

        }
    }
})();
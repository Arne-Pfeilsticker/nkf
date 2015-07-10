(function () {
    'use strict';

    angular.module('nkfApp').controller('FrameworkController', FrameworkController);

    FrameworkController.$inject = ['framework', 'uiGridConstants'];

    function FrameworkController(framework, uiGridConstants) {
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
            rowHeight: 30,
            headerHeight: 30,
            columnDefs: [
                {field: 'id', displayName: 'Konto', width: '*'},
                {field: 'parent_id', visible: false, width: '*'},
                {field: 'breakdown', displayName: 'Gliederung', visible: false, width: '*'},
                {field: 'sign', displayName: 'VZ', visible: false, width: '*'},
                {field: 'nkf_account', displayName: 'NKF-Konto', visible: false},
                {field: 'label', displayName: 'Bezeichnung', width: '60%'},
                {field: 'shortcut', displayName: 'Kurzbezeichnung', visible: false},
                {field: 'beneficiary', displayName: 'Leistungsempfänger', visible: false},
                {field: 'provider', displayName: 'Leister', visible: false},
                {field: '$$treeLevel', displayName: 'Ebene', width: '8%'}
            ],
            importerDataAddCallback: function(grid, newObjects){
                vm.framework = vm.framework.concat(newObjects);
            }
        };

        activate();

        ////////////////

        function activate() {

        }

        vm.getTableHeight = function() {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: (vm.gridOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
    }
})();
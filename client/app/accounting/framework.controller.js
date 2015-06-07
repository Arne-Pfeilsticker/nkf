(function () {
    'use strict';

    angular.module('nkfApp').controller('FrameworkController', FrameworkController);

    FrameworkController.$inject = ['framework'];

    function FrameworkController(framework) {
        /* jshint validthis: true */
        var vm = this;
        vm.framework = framework;

        vm.activate = activate;

        // Add Tree levels
        for (var i = 0; i < vm.framework.length; i++) {
            var pid = '';
            if (vm.framework[i].id.length < 11) {
                pid = (vm.framework[i]).parent_id;
                vm.framework[i].$$treeLevel = Math.max(0,pid.length - 5);
            }
        }

        vm.gridOptions = {
            data: 'vm.framework',
            enableGridMenu: true,
            enableSorting: true,
            enableFiltering: true,
            showTreeExpandNoChildren: true,
            columnDefs: [
                {field: 'id', displayName: 'Konto', width: '*'},
                {field: 'parent_id', visible: false, width: '*'},
                {field: 'breakdown', displayName: 'Gliederung', width: '*'},
                {field: 'sign', displayName: 'VZ', width: '*'},
                {field: 'nkf_account', displayName: 'NKF-Konto'},
                {field: 'label', displayName: 'Bezeichnung'},
                {field: 'shortcut', displayName: 'Kurzbezeichnung'},
                {field: 'beneficiary', displayName: 'Leistungsempfänger'},
                {field: 'provider', displayName: 'Leister'},
                {field: '$$treeLevel', displayName: 'Ebene'}
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
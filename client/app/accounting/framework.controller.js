(function () {
    'use strict';

    angular.module('nkfApp').controller('FrameworkController', FrameworkController);

    FrameworkController.$inject = ['framework', 'nkfApi', 'uiGridConstants'];

    function FrameworkController(framework, nkfApi, uiGridConstants) {
        /* jshint validthis: true */
        var vm = this;
        vm.framework = framework;

        vm.loading = false;

        vm.activate = activate;

        vm.gridOptions = {
            data: 'vm.framework',
            enableGridMenu: true,
            enableSorting: true,
            enableFiltering: true,
            enableColumnResize: true,
            //showTreeExpandNoChildren: false,
            rowHeight: 30,
            headerHeight: 30,
            columnDefs: [
                {field: 'id', displayName: 'Konto', width: '13%'},
                {field: 'parent_id', visible: false, width: '*'},
                {field: 'breakdown', displayName: 'Gliederung', visible: false, width: '*'},
                {field: 'sign', displayName: 'VZ', visible: false, width: '*'},
                {field: 'nkf_account', displayName: 'NKF-Konto', visible: false},
                {field: 'label', displayName: 'Bezeichnung', width: '40%'},
                {field: 'shortcut', displayName: 'Kurzbezeichnung', visible: false},
                {field: 'beneficiary', displayName: 'Leistungsempfänger', visible: false},
                {field: 'provider', displayName: 'Leister', visible: false},
                {field: 'treeLevel', displayName: 'Ebene', width: '*'},
                {field: 'rid', displayName: 'RId', visible: false, width: '*'},
                {field: '$path', displayName: 'Pfad', visible: false, width: '*'},
                {field: 'subaccounts', displayName: 'Anz. Unterkonten', width: '*'}
            ],
            importerDataAddCallback: function(grid, newObjects){
                vm.framework = vm.framework.concat(newObjects);
            },
            onRegisterApi: function(gridApi){
                vm.gridApi = gridApi;
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
                height: (vm.gridOptions.data.length * rowHeight + headerHeight) + 'px'
            };
        };

        // vm.values = [{"personId":"05124000","productId":"111","nkfAccount":"6","bookingYear":2010,"amount":46989779},{"personId":"05124000","productId":"111","nkfAccount":"6141","bookingYear":2010,"amount":69230},{"personId":"05124000","productId":"111","nkfAccount":"6146","bookingYear":2010,"amount":6000}];
        vm.importFramework = function (values) {
            vm.loading = true;
            console.log(vm.framework[0]);
            console.log(vm.framework[0].id);
            //var frstr = "{" + JSON.stringify(values) + "}";
            //var frstr = {id:"NKF05",label:"Kontenrahmen"};
            //var frstr = vm.framework[0];
            vm.hdata = { data: values };

            console.log(vm.hdata);

            nkfApi.importFramework( vm.hdata )
                .then(function (results) {
                    console.log('Imported Framework data', results);
                })
                .catch(function (err) {
                    console.log('Error Imported Framework data', err);
                })
                .finally(function () {
                    vm.loading = false;
                });
        };

        vm.importFramework2 = function (values) {
            var frstr = JSON.stringify(values);
            console.log(frstr);

            var frobj = JSON.parse(frstr);
            console.log(frobj);

        };
    }
})();
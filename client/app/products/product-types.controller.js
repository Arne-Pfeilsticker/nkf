(function () {
    'use strict';

    angular.module('nkfApp').controller('ProductTypesController', ProductTypesController);

    ProductTypesController.$inject = ['productTypes', 'uiGridConstants'];

    function ProductTypesController(productTypes, uiGridConstants) {
        /* jshint validthis: true */
        var vm = this;
        vm.productTypes = productTypes;

        vm.activate = activate;

        vm.gridOptions = {
            data: 'vm.productTypes',
            enableGridMenu: true,
            enableSorting: true,
            enableFiltering: true,
            enableColumnResize: true,
            //showTreeExpandNoChildren: false,
            rowHeight: 30,
            headerHeight: 30,
            columnDefs: [
                {field: 'id', displayName: 'Id', width: '*'},
                {field: 'parent_id', visible: false, width: '*'},
                {field: 'label', displayName: 'Bezeichnung', width: '60%'},
                {field: 'subproducts', displayName: 'Anzahl Unterprodukte', visible: false, width: '*'},
                {field: 'treeLevel', displayName: 'Ebene', width: '*'}
            ],
            importerDataAddCallback: function(grid, newObjects){
                vm.productTypes = vm.productTypes.concat(newObjects);
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
    }
})();
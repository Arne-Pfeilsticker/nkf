(function () {
    'use strict';

    angular.module('nkfApp').controller('PersonsController', PersonsController);

    PersonsController.$inject = ['persons', 'uiGridTreeViewConstants'];
    // PersonsController.$inject = ['persons'];

    function PersonsController(persons, uiGridTreeViewConstants) {
        /* jshint validthis: true */
        var vm = this;
        vm.persons = persons;

        vm.activate = activate;

        // Suppress + sign for Tree levels with no children (it does not work)
        //for (var i = 0; i < vm.persons.length; i++) {
        //    var pid = '';
        //    if (vm.persons[i].personsubtypes == 0) {
        //        vm.persons[i].$$treeLevel = null;
        //    }
        //}

        vm.gridOptions = {
            data: 'vm.persons',
            enableGridMenu: true,
            enableSorting: true,
            enableFiltering: true,
            showTreeExpandNoChildren: false, // This should suppress + sign for leaves.
            columnDefs: [
                {field: 'id', displayName: 'Kennzahl', width: '*'},
                {field: 'parent_id', visible: false, width: '*'},
                {field: 'person_type', displayName: 'Art', width: '*'},
                {field: 'name', displayName: 'Name', width: '*'},
                {field: 'wiki_url', displayName: 'Wiki-URL'},
                {field: '$$treeLevel', displayName: 'Ebene'}
            ],
            importerDataAddCallback: function(grid, newObjects){
                vm.persons = vm.persons.concat(newObjects);
            }
        };

        activate();

        ////////////////

        function activate() {

        }
    }
})();
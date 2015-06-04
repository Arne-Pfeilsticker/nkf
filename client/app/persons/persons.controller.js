(function () {
    'use strict';

    angular.module('nkfApp').controller('PersonsController', PersonsController);

    PersonsController.$inject = ['persons', 'uiGridTreeViewConstants'];

    function PersonsController(persons, uiGridTreeViewConstants) {
        /* jshint validthis: true */
        var vm = this;
        vm.persons = persons;

        vm.activate = activate;

        // Add Tree levels
        for (var i = 0; i < vm.persons.length; i++) {
            var pid = '';
            if (vm.persons[i].id.length < 11) {
                pid = (vm.persons[i]).parent_id;
                vm.persons[i].$$treeLevel = Math.max(0,pid.length - 5);
            }
        }

        vm.gridOptions = {
            data: 'vm.persons',
            enableGridMenu: true,
            enableSorting: true,
            enableFiltering: true,
            showTreeExpandNoChildren: true,
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
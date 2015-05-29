(function () {
    'use strict';

    angular.module('nkfApp').controller('PersonsCtrl', PersonsCtrl);

    // PersonsCtrl.$inject = ['initialData'];
    /* @ngInject */
    // function PersonsCtrl(initialData) {
    function PersonsCtrl() {
        /* jshint validthis: true */
        var vm = this;

        // vm.persons = initialData;
        vm.activate = activate;

        // vm.importData = importData;
        vm.parsedData = [
            {
                '@type': 'd',
                '@rid': '#12:0',
                '@version': 2,
                '@class': 'Persons',
                id: 'de',
                parent_id: null,
                person_type: 'Bund',
                name: 'Deutschland',
                begin: null,
                end: null,
                wiki_url: 'Deutschland'
            },
            {
                '@type': 'd',
                '@rid': '#12:1',
                '@version': 11,
                '@class': 'Persons',
                id: 'de.05',
                parent_id: 'de',
                person_type: 'Land',
                name: 'Nordrhein-Westfalen',
                begin: null,
                end: null,
                wiki_url: 'Nordrhein-Westfalen'
            }

        ];

        vm.gridOptions = {
            data: 'vm.parsedData',
            enableGridMenu: true,
            columnDefs: [
                {field: 'id'},
                {field: 'parent_id'},
                {field: 'person_type'},
                {field: 'name'},
                {field: 'parent_id'},
                {field: 'wiki_url'}
            ],
            //importerDataAddCallback: function(grid, newObjects){
            //    vm.parsedData = vm.parsedData.concat(newObjects);
            //},

            enableFiltering: true
        };

        activate();

        ////////////////

        function activate() {

        }
    }
})();
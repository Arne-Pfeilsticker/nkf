(function () {
    'use strict';

    angular.module('nkfApp').factory('personsInitialDataService', personsInitialDataService);

    personsInitialDataService.$inject = ['$q', 'nkfApi'];

    /* @ngInject */
    function personsInitialDataService($q, nkfApi) {
        var service = {
            getData: getData
        };

        return service;

        ////////////////

        function getData() {

            return $q.all([
                nkfApi.getPersons(),
                nkfApi.getPersonTypes()
            ]).then(function(results){
                return {
                    persons: results[0],
                    personTypes: results[1]
                };
            });
        }
    }
})();
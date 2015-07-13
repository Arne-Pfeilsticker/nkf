(function (nkfApp) {
    'use strict';

    nkfApp.factory('DataImportService', DataImportService);

    DataImportService.$inject = ['$state', '$q', 'ldbApi'];

    function DataImportService($state, $q, ldbApi) {
        /* jshint validthis: true */
        var vm = this;

        var service = {
            // Export Services
            httpTableByGKZ: httpTableByGKZ
        };

    }
}(angular.module('nkfApp')));
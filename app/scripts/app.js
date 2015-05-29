(function () {
    'use strict';
    var app = angular.module('nkfApp', [
        // Angular modules
        //'ngRoute',
        'ngSanitize',

        // 3rd Party Modules
        'ui.bootstrap',
        'ui.router',
        //'ui.calendar',
        //'uiGmapgoogle-maps',
        'ui.ace',
        'ui.grid',
        //'ui.grid.treeView',
        //'ui.grid.importer',
        //'ui.grid.edit',
        //'ui.grid.resizeColumns',
        'ui.select'
        //'ui.alias'
    ]);

    //app.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', configRoutes]);
    app.config(['$stateProvider', '$urlRouterProvider', configRoutes]);

    function configRoutes($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'scripts/home/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'vm',
                data: {
                    property1: 'foo',
                    property2: 'bar'
                }
            })
            .state('budget', {
                url: '/budget',
                templateUrl: 'scripts/budget/budget.html',
                controller: 'BudgetCtrl',
                controllerAs: 'vm',
                data: {
                    property1: 'foo',
                    property2: 'bar'
                }

            })
            .state('persons', {
                url: '/persons',
                templateUrl: 'scripts/persons/persons.html',
                controller: 'PersonsCtrl',
                controllerAs: 'vm',
                resolve: {
                    initialData: ['nkfApi', function (nkfApi) {
                        return nkfApi.getPersons();
                    }]
                }

            })
            .state('persontypes', {
                url: '/persontypes',
                templateUrl: 'scripts/persons/person-types.html',
                controller: 'PersonTypesCtrl',
                controllerAs: 'vm',
                resolve: {
                    initialData: ['nkfApi', function (nkfApi) {
                        return nkfApi.getPersonTypes();
                    }]
                }
            })
        ;

        $urlRouterProvider.otherwise('/');
    }

    // app.run(['$rootScope', '$state', '$stateParams', 'stateWatcherService', function ($rootScope, $state, $stateParams, $stateWatcherService) {
    // jshint unused:false
    app.run(['$state', 'stateWatcherService', function ($state, stateWatcherService) {
        /* jshint validthis: true */
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        //$rootScope.$state = $state;
        //$rootScope.$stateParams = $stateParams;
    }]);
})();
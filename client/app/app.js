(function () {
    'use strict';
    var app = angular.module('nkfApp', [
        // Angular modules
        //'ngRoute',
        //'ngSanitize',


        //'ngResource',
        // 3rd Party Modules
        //'ui.bootstrap',
        //'ui.router',
        //'ui.calendar',
        //'uiGmapgoogle-maps',
        //'ui.ace',
        //'ui.grid',
        //'ui.grid.treeView',
        //'ui.grid.importer',
        //'ui.grid.edit',
        //'ui.grid.resizeColumns',
        //'ui.select'
        //'ui.alias'
        'app.core'
    ]);

    app.config(['$httpProvider', function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$httpProvider.defaults.headers.post.Accept = 'application/json, text/javascript';
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        //$httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
        //$httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
        //$httpProvider.defaults.headers.common.Accept = 'application/json, text/javascript';
        //$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        $httpProvider.defaults.useXDomain = true;
        // $httpProvider.defaults.withCredentials = true;
    }]);

    //app.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', configRoutes]);
    app.config(['$stateProvider', '$urlRouterProvider', configRoutes]);

    function configRoutes($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                data: {
                    property1: 'foo',
                    property2: 'bar'
                }
            })
            .state('budget', {
                url: '/budget',
                templateUrl: 'app/budget/budget.html',
                controller: 'BudgetController',
                controllerAs: 'vm',
                resolve: {
                    persons: ['ldbApi', function (ldbApi) {
                        return ldbApi.httpTableByGKZ('71147GJ002', '05111000');
                        // return ldbApi.httpTableByGKZ('71147GJ002', '05111000');
                    }]
                }

            })
            .state('persons', {
                url: '/persons',
                templateUrl: 'app/persons/persons.html',
                controller: 'PersonsController',
                controllerAs: 'vm',
                resolve: {
                    persons: ['nkfApi', function (nkfApi) {
                        return nkfApi.getPersons();
                    }]
                }

            })
            .state('persontypes', {
                url: '/persontypes',
                templateUrl: 'app/persons/person-types.html',
                controller: 'PersonTypesController',
                controllerAs: 'vm',
                resolve: {
                    personTypes: ['nkfApi', function (nkfApi) {
                        return nkfApi.getPersonTypes();
                    }]
                }
            })
            .state('framework', {
                url: '/framework',
                templateUrl: 'app/accounting/framework.html',
                controller: 'FrameworkController',
                controllerAs: 'vm',
                resolve: {
                    framework: ['nkfApi', function (nkfApi) {
                        return nkfApi.getFramework();
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
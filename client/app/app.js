// Autor Arne Pfeilsticker
// Email: Arne.Pfeilsticker@pfeilsticker.de

// Die Veröffentlichung erfolgt unter Creative Comons CC-BY-SA. Eine kommerzielle Nutzung wird ausgeschlossen,
// bei Verwendung des Werks oder Teilen davon ist der Name des Urhebers zu nennen, eine Weitergabe ist nur zu gleichen
// Bedingungen möglich.

(function (nkfApp) {
    'use strict';

    nkfApp.config(['$httpProvider', '$logProvider', function ($httpProvider, $logProvider) {
        //$httpProvider.defaults.headers.post.Accept = 'application/json, text/javascript';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        //$httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
        //$httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
        //$httpProvider.defaults.headers.common.Accept = 'application/json, text/javascript';
        //$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        $httpProvider.defaults.headers.common.Authorization = 'Basic YWRtaW46YWRtaW4=';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        $httpProvider.defaults.useXDomain = true;
        //$httpProvider.defaults.withCredentials = true;
        $logProvider.debugEnabled(true);
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

    //nkfApp.config('$mdThemingProvider', '$mdIconProvider', function ($mdThemingProvider, $mdIconProvider) {
    //
    //    $mdIconProvider
    //        .iconSet('action', './images/icons/action-icons.svg', 24)
    //        .iconSet('content', './images/icons/content-icons.svg', 24)
    //        .iconSet('file', './images/icons/file-icons.svg', 24)
    //        .iconSet('navigation', './images/icons/navigation-icons.svg', 24)
    //        .icon("menu", "./assets/svg/menu.svg", 24)
    //        .icon("share", "./assets/svg/share.svg", 24)
    //        .icon("google_plus", "./assets/svg/google_plus.svg", 512)
    //        .icon("hangouts", "./assets/svg/hangouts.svg", 512)
    //        .icon("twitter", "./assets/svg/twitter.svg", 512)
    //        .icon("phone", "./assets/svg/phone.svg", 512)
    //        .icon('kommune', './images/icons/icon_kommune.png', 24)
    //        .icon('arrowright', './images/icons/arrow_right.svg', 150);
    //
    //    $mdThemingProvider.theme('default')
    //        .primaryPalette('blue')
    //        .accentPalette('deep-orange');
    //
    //});


    nkfApp.config(['$mdThemingProvider', '$mdIconProvider', function ($mdThemingProvider, $mdIconProvider) {

        $mdIconProvider
            //.iconSet('action', './images/icons/action-icons.svg', 24)
            //.iconSet('alert', './images/icons/alert-icons.svg', 24)
            //.iconSet('av', './images/icons/av-icons.svg', 24)
            //.iconSet('communication', './images/icons/communication-icons.svg', 24)
            .iconSet('content', './images/icons/content-icons.svg', 24)
            //.iconSet('device', './images/icons/device-icons.svg', 24)
            //.iconSet('editor', './images/icons/editor-icons.svg', 24)
            .iconSet('file', './images/icons/file-icons.svg', 24)
            //.iconSet('hardware', './images/icons/hardware-icons.svg', 24)
            //.iconSet('icons', './images/icons/icons-icons.svg', 24)
            //.iconSet('image', './images/icons/image-icons.svg', 24)
            //.iconSet('maps', './images/icons/maps-icons.svg', 24)
            .iconSet('navigation', './images/icons/navigation-icons.svg', 24)
            //.iconSet('notification', './images/icons/notification-icons.svg', 24)
            //.iconSet('social', './images/icons/social-icons.svg', 24)
            //.iconSet('toggle', './images/icons/toggle-icons.svg', 24)
            .icon('kommune', './images/icons/icon_kommune.png', 24)
            .icon('arrowright', './images/icons/arrow_right.svg', 150)
        ;

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('deep-orange');

    }]);


    //app.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', configRoutes]);
    nkfApp.config(['$stateProvider', '$urlRouterProvider', configRoutes]);

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
                    productTypes: ['nkfApi', function (nkfApi) {
                        return nkfApi.getProductTypes();
                    }],
                    personsBooked: ['nkfApi', function (nkfApi) {
                        return nkfApi.getPersonsBooked();
                    }],
                    framework: ['nkfApi', function (nkfApi) {
                        return nkfApi.getFramework();
                    }],
                    frameworkShortcuts: ['nkfApi', function (nkfApi) {
                        return nkfApi.getFrameworkShortcuts();
                    }]
                }
            })
            .state('import', {
                url: '/import',
                templateUrl: 'app/data-import/data-import.html',
                controller: 'DataImportController',
                controllerAs: 'vm'
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
            .state('producttypes', {
                url: '/producttypes',
                templateUrl: 'app/products/product-types.html',
                controller: 'ProductTypesController',
                controllerAs: 'vm',
                resolve: {
                    productTypes: ['nkfApi', function (nkfApi) {
                        return nkfApi.getProductTypes();
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
    nkfApp.run(['$state', 'stateWatcherService', function ($state, stateWatcherService) {
        /* jshint validthis: true */
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        //$rootScope.$state = $state;
        //$rootScope.$stateParams = $stateParams;
    }]);

    /**
     * Description:
     *     removes white space from text. useful for html values that cannot have spaces
     * Usage:
     *   {{some_text | nospace}}
     */
    nkfApp.filter('nospace', function () {
        return function (value) {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    });

    //replace uppercase to regular case
    nkfApp.filter('humanizeDoc', function () {
        return function (doc) {
            if (!doc) {
                return;
            }
            if (doc.type === 'directive') {
                return doc.name.replace(/([A-Z])/g, function ($1) {
                    return '-' + $1.toLowerCase();
                });
            }

            return doc.label || doc.name;
        };
    });
})(angular.module('nkfApp'));
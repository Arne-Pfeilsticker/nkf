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
    //'ui.grid',
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
          //views: {
          //    '': {
          //        templateUrl: 'app/home/home.html',
          //        controller: 'HomeCtrl',
          //        controllerAs: 'vm',
          //        data: {
          //            property1: 'foo',
          //            property2: 'bar'
          //        }
          //    },
          //    'view1@': {
          //        template: '<div>This is View 1</div>'
          //    },
          //    'view2@': {
          //        template: '<div>This is View 2</div>'
          //    },
          //    'view3@': {
          //        template: '<div>This is View 3</div>'
          //    }
          //}
        });

    $urlRouterProvider.otherwise('/');
  }

  app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams)  {
      // It's very handy to add references to $state and $stateParams to the $rootScope
      // so that you can access them from any scope within your applications.For example,
      // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
      // to active whenever 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
  }]);
})();

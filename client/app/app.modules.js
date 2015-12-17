(function () {
    'use strict';

    angular.module('nkfApp', ['app.layout']);

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate',
        'ngAria',
        'ngMaterial',
        //'ngMdIcons',
        'ngSanitize',
        /*
         * 3rd Party modules
         */
        'ui.router',
        'ui.ace',
        'ui.grid',
        'ui.grid.treeView',
        'ui.grid.importer',
        'ui.grid.exporter',
        'ui.grid.edit',
        'ui.grid.resizeColumns',
        'ui.grid.autoResize',
        //'d3',
        //'crossfilter',
        'angularDc'
    ]);

    angular.module('mdThemeColors', ['ngMaterial']);

    angular.module('app.layout', ['app.core', 'mdThemeColors']);

})();

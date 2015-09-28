(function () {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate',
        'ngAria',
        'ngMaterial',
        //'ngMaterial',
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
        //'ui.select',
        //'ui.alias'
        //'angularSoap'
        //'lodash',
        //'dcjs',
        //'d3',
        //'crossfilter',
        'angularDc'
    ]);

    angular.module('mdThemeColors', ['ngMaterial']);

    angular.module('app.layout', ['app.core', 'mdThemeColors']);

    angular.module('nkfApp', ['app.layout']);

})();

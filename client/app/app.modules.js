(function () {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate',
        'ngMaterial',
        'ngAria',
        'ngSanitize',
        /*
         * 3rd Party modules
         */
        'ui.router',
        //'ui.calendar',
        //'uiGmapgoogle-maps',
        'ui.ace',
        'ui.grid',
        'ui.grid.treeView',
        'ui.grid.importer',
        'ui.grid.exporter',
        'ui.grid.edit',
        'ui.grid.resizeColumns',
        'ui.grid.autoResize',
        'ui.select'
        //'ui.alias'
        //'angularSoap'
    ]);

    angular.module('app.services', []);

    angular.module('app.layout', ['app.services']);

    angular.module('nkfApp', [
        'app.layout',
        'app.core'
    ]);
})();

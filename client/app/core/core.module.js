(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngSanitize',
        /*
         * Our reusable cross app code modules
         */
        // 'blocks.exception', 'blocks.logger', 'blocks.router',
        /*
         * 3rd Party modules
         */
        // 'ngplus',

        // 3rd Party Modules
        'ui.bootstrap',
        'ui.router',
        //'ui.calendar',
        //'uiGmapgoogle-maps',
        'ui.ace',
        'ui.grid',
        'ui.grid.treeView',
        //'ui.grid.importer',
        'ui.grid.edit',
        'ui.grid.resizeColumns',
        'ui.select'
        //'ui.alias'
    ]);
})();
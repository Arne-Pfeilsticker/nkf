(function (appLayout) {
    'use strict';

    appLayout.controller('MenuController', MenuController);

    MenuController.$inject = ['$state', 'mdThemeColors'];

    function MenuController($state, mdThemeColors) {
        /* jshint validthis: true */
        var vm = this;
        vm.mdThemeColors = mdThemeColors;

    }
})(angular.module('app.layout'));
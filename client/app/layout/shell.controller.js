(function (appLayout) {
    'use strict';

    appLayout.controller('ShellController', ShellController);

    ShellController.$inject = ['$rootScope', '$log', '$state', '$timeout', '$location', 'menu', '$mdSidenav' ];

    function ShellController($rootScope, $log, $state, $timeout, $location, menu, $mdSidenav) {
        /* jshint validthis:true */
        var vm = this;
        //functions for menu-link and menu-toggle
        vm.toggleMenu = toggleMenu;
        vm.isOpen = isOpen;
        vm.toggleOpen = toggleOpen;
        vm.isSectionSelected = isSectionSelected;
        vm.autoFocusContent = false;
        vm.menu = menu;

        // console.log('menu: ', vm.menu);

        vm.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        activate();

        function activate() { }

        function isOpen(section) {
            return menu.isSectionSelected(section);
        }

        function toggleOpen(section) {
            menu.toggleSelectSection(section);
        }

        function toggleMenu() {
            $mdSidenav('left').toggle();
        };

        function isSectionSelected(section) {
            var selected = false;
            var openedSection = menu.openedSection;
            if (openedSection === section) {
                selected = true;
            }
            else if (section.children) {
                section.children.forEach(function (childSection) {
                    if (childSection === openedSection) {
                        selected = true;
                    }
                });
            }
            return selected;
        }
    }
}(angular.module('app.layout')));

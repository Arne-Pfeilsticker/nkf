(function () {
    'use strict';

    angular.module('nkfApp').controller('HomeController', HomeController);

    HomeController.$inject = ['$state'];

    function HomeController($state) {
        /* jshint validthis: true */
        var vm = this;
        vm.notesCollapsed = true;
        vm.navigate = navigate;
        vm.activate = activate;

        activate();

        ////////////////

        function activate() {
            console.log('current state data', $state.current.data);
        }

        function navigate(){
            $state.go('persontypes');
        }

    }
})();
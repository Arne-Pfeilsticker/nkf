(function () {
    'use strict';

    angular.module('nkfApp').controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$state'];

    function HomeCtrl($state) {
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
(function () {
    'use strict';

    angular.module('nkfApp').controller('BudgetController', BudgetController);

    BudgetController.$inject = ['$state'];

    function BudgetController($state) {
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
            $state.go('home');
        }

    }
})();
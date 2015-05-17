(function () {
    'use strict';

    angular.module('nkfApp').controller('BudgetCtrl', BudgetCtrl);

    BudgetCtrl.$inject = ['$state'];

    function BudgetCtrl($state) {
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
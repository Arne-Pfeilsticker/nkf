(function (nkfApp) {
    'use strict';

    nkfApp.controller('HomeController', HomeController);

    HomeController.$inject = ['$state', '$http', '$window', '$sce', 'mdThemeColors'];

    function HomeController($state, $http, $window, $sce, mdThemeColors) {
        /* jshint validthis: true */
        var vm = this;
        vm.notesCollapsed = true;
        vm.navigate = navigate;
        vm.activate = activate;
        vm.mdThemeColors = mdThemeColors;
        vm.pdfcontent = '';

        activate();

        ////////////////

        function activate() {
            console.log('current state data', $state.current.data);
        }

        function navigate(){
            $state.go('persontypes');
        }

        vm.openPdf = function (uuid){
            $http({
                url : '/assets/Hilfe_NKF.pdf',
                method : 'GET',
                headers : {
                    'Authorization': 'Basic YWRtaW46YWRtaW4=',
                    'Content-Type' : 'application/pdf'
                },
                responseType : 'arraybuffer'
            }).success(function(data, status, headers, config) {
                var fileName = '/assets/Hilfe_NKF.pdf';
                //var a = document.createElement("a");
                //a.style = "display: none";
                var pdfFile = new Blob([ data ], {type : 'application/pdf'});
                var pdfUrl = URL.createObjectURL(pdfFile);
                vm.pdfcontent = $sce.trustAsResourceUrl(pdfUrl);
                window.open(vm.pdfcontent);
                // a.href = pdfUrl;
                // a.download = fileName;
                // a.target = '_blank';
                // a.click();
                //var printwWindow = $window.open(pdfUrl);
                //printwWindow.print();
            }).error(function(data, status, headers, config) {
                alert('Fehler beim Laden der Hilfe-Datei.')
            });
        };

        // vm.openPdf = function (uuid){
        //     $http({
        //         url : '/assets/Hilfe_NKF.pdf',
        //         method : 'GET',
        //         headers : {
        //             'Content-type' : 'application/pdf'
        //         },
        //         responseType : 'arraybuffer'
        //     }).success(function(data, status, headers, config) {
        //         var pdfFile = new Blob([ data ], {type : 'application/pdf'});
        //         var pdfUrl = URL.createObjectURL(pdfFile);
        //
        //         var printwWindow = $window.open(pdfUrl);
        //         //printwWindow.print();
        //     }).error(function(data, status, headers, config) {
        //         alert('Sorry, something went wrong')
        //     });
        // };

    }
})(angular.module('nkfApp'));
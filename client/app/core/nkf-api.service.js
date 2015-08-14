/**
 * API to communicate with the WebServices of the Landesdatenbank NRW-Server
 * https://www.landesdatenbank.nrw.de/
 * These functions are defined and can be uploaded with database/serverside.functions.js
 */
(function (appCore) {
    'use strict';

    appCore.factory('nkfApi', nkfApi);

    nkfApi.$inject = ['$http'];

    function nkfApi($http) {
        var service = {
            // Person types
            addPersonType: addPersonType,
            deletePersonType: deletePersonType,
            getPersonType: getPersonType,
            getPersonTypes: getPersonTypes,
            savePersonType: savePersonType,
            // Persons
            deletePerson: deletePerson,
            getPersons: getPersons,
            getPersonsBooked: getPersonsBooked,
            savePerson: savePerson,
            // Product types
            getProductTypes: getProductTypes,
            // Accounting
            getFrameworkShortcuts: getFrameworkShortcuts,
            getFramework: getFramework,
            getBookingsByPid: getBookingsByPid,
            importBookings: importBookings
        };

        var baseUrl = 'http://localhost:2480/function/nkf';
        var requestConfig = {
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4='
                // 'Accept-Encoding': 'gzip,deflate',
                // 'Content-Length': 500000
            }
        };

        return service;

        //////////////////////////////////////////

        // Person Types (= legal entity typ)

        function addPersonType(personType) {
            return httpPost('/personTypes', personType);
        }

        function deletePersonType(id) {
            return httpDelete('/personTypes/' + id);
        }

        function getPersonType(id) {
            return httpGet('/personTypes/' + id);
        }

        function getPersonTypes() {
            return httpGet('/persons_getTypes');
        }

        function savePersonType(personType) {
            return httpPatch('/personTypes/' + personType.id, personType);
        }

        // Persons (= legal entity = legal or natural person)

        function deletePerson(id) {
            return httpDelete('/persons/' + id);
        }

        function getProductTypes() {
            return httpGet('/products_getTypes');
        }


        //function getPerson(id){
        //    var url = getUrlByPersonId('/persons', id);
        //    return httpGet(url);
        //}

        function savePerson(person){
            return saveItem('/persons', person);
        }


        function getPersons() {
            return httpGet('/persons_getAll');
        }

        function getPersonsBooked() {
            return httpGet('/persons_booked');
        }

        // Accounting

        function getFramework() {
            return httpGet('/getFramework');
        }

        function getFrameworkShortcuts() {
            return httpGet('/framework_getShortcuts');
        }

        function getBookingsByPid(pid) {
            return httpGet('/getBookingsByPid/' + pid);
        }

        function importBookings(values) {
            return httpPost('/importBookings', values);
        }



        /** Private Methods **/

        //function getUrlByPersonTypeId(url, personTypeId){
        //    return url + '?$top=100&$filter=' + encodeURIComponent('personTypeId eq \'' + personTypeId + '\'');
        //}

        function httpDelete(url){
            return httpExecute(url, 'DELETE');
        }

        function httpExecute(requestUrl, method, data){

            return $http({
                url: baseUrl + requestUrl,
                method: method,
                data: data,
                headers: requestConfig.headers }).then(function(response){

                console.log('**response from EXECUTE', response);
                return response.data.result;
            });
        }

        function httpGet(url){
            return httpExecute(url, 'GET');
        }

        function httpPatch(url, data){
            return httpExecute(url, 'PATCH', data);
        }

        function httpPost(url, data){
            return httpExecute(url, 'POST', data);
        }

        function saveItem(url, item){
            if (item.id) {
                return httpPatch(url + '/' + item.id, item);
            } else {
                return httpPost(url, item);
            }
        }
    }
})(angular.module('app.core'));

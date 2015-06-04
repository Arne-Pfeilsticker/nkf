/**
 * API to communicate with the OrientDB-Server
 * All API calls have a corresponding server side function to be executed.
 * These functions are defined and can be uploaded with database/serverside.functions.js
 */
(function (module) {
    'use strict';

    module.factory('nkfApi', nkfApi);

    nkfApi.$inject = ['$http', 'appSpinner'];

    function nkfApi($http, appSpinner) {
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
            savePerson: savePerson
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
            return httpGet('/personTypes');
        }

        function savePersonType(personType) {
            return httpPatch('/personTypes/' + personType.id, personType);
        }

        // Persons (= legal entity = legal or natural person)

        function deletePerson(id) {
            return httpDelete('/persons/' + id);
        }


        //function getPerson(id){
        //    var url = getUrlByPersonId('/persons', id);
        //    return httpGet(url);
        //}

        function savePerson(person){
            return saveItem('/persons', person);
        }


        function getPersons() {
            return httpGet('/persons');
        }


        /** Private Methods **/

        //function getUrlByPersonTypeId(url, personTypeId){
        //    return url + '?$top=100&$filter=' + encodeURIComponent('personTypeId eq \'' + personTypeId + '\'');
        //}

        function httpDelete(url){
            return httpExecute(url, 'DELETE');
        }

        function httpExecute(requestUrl, method, data){
            appSpinner.showSpinner();
            return $http({
                url: baseUrl + requestUrl,
                method: method,
                data: data,
                headers: requestConfig.headers }).then(function(response){

                appSpinner.hideSpinner();
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

/**
 * API to communicate with the WebServices of the Landesdatenbank NRW-Server
 * https://www.landesdatenbank.nrw.de/
 *
 */
(function (appCore) {
    'use strict';

    appCore.factory('ldbApi', ldbApi);

    ldbApi.$inject = ['$http', '$log', 'ldbApiConfig'];
    function ldbApi($http, $log, ldbApiConfig) {

        var service = {
            // Export Services
            httpTableByGKZ: httpTableByGKZ
        };

        // delete $http.defaults.headers.common['X-Requested-With']; // Nach app.js verlagert

        /**
         * Transform XML response to array of csv strings
         * @param data {text} Response
         * @param headersGetter
         * @param status
         * @returns {array}
         */
        var transformXmlResponse = $http.defaults.transformResponse.concat([
            function (data, headersGetter) {

                var headers = headersGetter();

                var contentType = headers['content-type'];

                if (contentType.indexOf('xml') === -1) {
                    return data;
                }
                // The first 14ten lines and the last 2 linens are xml wrapper around the csv data.
                var lines = data.split('\n');
                lines.splice(0, 14);
                lines.splice(-2, 2);

                // Each line should look like this: "D;05111000;PRODGR-111;KONTO-7;2010;414807620;p;;0"

                var importedData = [];
                var columns, pid, acc;
                for (var i = 0; i < lines.length; i++) {
                    columns = lines[i].split(';');
                    pid = columns[2].substring(7); // Product id
                    acc = columns[3].substring(6); // Nkf-account

                    // Skip aggregated data
                    // Product-Id 999: all Products
                    // NKF-Account length < 4: Account group, class or framework part
                    if (pid !== '999' && acc.length === 4 ) {
                        importedData.push(
                            {
                                personId: columns[1],
                                productId: pid,
                                nkfAccount: columns[3].substring(6),
                                bookingYear: +columns[4],
                                amount: +columns[5]
                            }
                        );
                    }
                }
                return importedData;
            }
        ]);

        return service;

        //////////////////////////////////////////

        // Export Service by GKZ (= Gemeindekennzahl)

        function httpTableByGKZ(table, personId, bookingYear) {
            var params = ldbApiConfig.dataExportParameters;
            params.namen = table;
            params.regionalschluessel = personId;
            params.startjahr = bookingYear;
            params.endjahr = bookingYear;

            var parastr = ldbApiConfig.wsParametersToString(params);

            // var headers = {
            //     'Accept': 'application/xml'
            //     // 'Accept-Language': 'de'
            // };

            return $http({
                url: ldbApiConfig.wsEndpoint + parastr,
                method: 'GET',
                //headers: headers,
                transformResponse: transformXmlResponse
            })
                .then(function (result) {

                    $log.debug('Response from HTTP-request', result);
                    return result.data;

                })
                .catch(function (result) {
                    $log.message = 'Fehler: ' + result.status + ' ' + result.statusText + ', ' + result.data;
                });
        }
    }
}(angular.module('app.core')));

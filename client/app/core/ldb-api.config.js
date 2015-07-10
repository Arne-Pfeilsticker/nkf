/**
 * Parameters for working with Landesdatenbank NRW WebServices
 */
(function(appCore) {
    'use strict';

    appCore.factory('ldbApiConfig', ldbApiConfig);

    function ldbApiConfig() {

        var wsEndpoint = 'https://www.landesdatenbank.nrw.de/ldbnrwws/services/ExportService',

            wsAction = 'DatenExport',
            dataExportParameters = {
                method: 'DatenExport',
                kennung: 'NW014114',
                passwort: 'Nipa1gT2',
                namen: '71137NWGJ1',
                bereich: 'Alle',
                format: 'csv',
                werte: true,
                metadaten: false,
                zusatz: false,
                startjahr: 2010,
                endjahr: 2010,
                zeitscheiben: 0,
                regionalschluessel: '05111000',
                sachmerkmal: '',
                sachschluessel: '',
                stand: '01.01.1970',
                sprache: 'de'
            },
            tableExportParameters = {
                method: 'TabellenExport',
                kennung: 'NW014114',
                passwort: 'Nipa1gT2',
                namen: '71147E-14i',
                bereich: 'Alle',
                format: 'csv',
                strukturinformation: false,
                komprimierung: true,
                startjahr: 2010,
                endjahr: 2010,
                zeitscheiben: 0,
                regionalschluessel: '05111000',
                sachmerkmal: '',
                sachschluessel: '',
                sprache: 'de'
            },

        // LdbWS Server User and Password
            ldbUser = 'NW014114',
            ldbPassword = 'Nipa1gT2';

        /**
         * Transforms data- or tableExportParameters into a string
         * @param wsParas {object}
         * @returns {string}
         *
         * The $httpParamSerializer can't be used because the output of the parameters is not as given.
         * The method parameter must be the first parameter.
         *
         * URL = wsEndpoint + wsParameterString
         */
        function wsParametersToString(wsParas) {
            var wsParameterString = '?';

            for (var key in wsParas) {
                if (wsParas.hasOwnProperty(key)) {
                    wsParameterString += key + '=' + wsParas[key] + '&';
                }
            }
            return wsParameterString.slice(0, -1);  // Get rid of the last & sign.
        }

        return {
            wsEndpoint: wsEndpoint,
            wsAction: wsAction,
            dataExportParameters: dataExportParameters,
            tableExportParameters: tableExportParameters,
            wsParametersToString: wsParametersToString,
            ldbUser: ldbUser,
            ldbPassword: ldbPassword
        };
    }
}(angular.module('app.core')));

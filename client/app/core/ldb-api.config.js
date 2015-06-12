/**
 * Parameters for working with Landesdatenbank NRW WebServices
 */
(function(module) {
    'use strict';

    module.factory('ldbApiConfig', ldbApiConfig);

    function ldbApiConfig() {

        var
        // Service Endpoint
            wsEndpoint = 'https://www.landesdatenbank.nrw.de/ldbnrwws/services/ExportService',
            wsAction = 'TabellenExport',
            wsParameters = {
                method: 'DatenExport',
                kennung: 'NW014114',
                passwort: 'Nipa1gT2',
                namen: '71147E-14i',
                bereich: 'Alle',
                format: 'csv',
                strukturinformation: false,
                komprimierung: true,
                startjahr: 2010,
                endjahr: 2010,
                zeitscheiben: 1,
                regionalschluessel: '05111000',
                sachmerkmal: '',
                sachschluessel: '',
                stand: '01.01.2000',
                sprache: 'de'
            },
            datenExportParameters = {
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
                zeitscheiben: 1,
                regionalschluessel: '05111000',
                sachmerkmal: '',
                sachschluessel: '',
                stand: '01.01.1970',
                sprache: 'de'
            },


        // LdbWS Server User and Password
            ldbUser = 'NW014114',
            ldbPassword = 'Nipa1gT2';

        // Import Path used by ETL-Tool
        //    ldbImportPath = process.cwd() + '/import';

        function wsParametersToString(wsParas) {
            var wsParameterString = '?';

            for (var key in wsParas) {
                wsParameterString += key + '=' + wsParas[key] + '&';
            }
            return wsParameterString.slice(0, -1);
        }

        var wsParameterString = wsParametersToString(wsParameters);

        var wsURL = wsEndpoint + wsAction + wsParameterString;

        return {
            wsEndpoint: wsEndpoint,
            wsAction: wsAction,
            wsParameters: wsParameters,
            datenExportParameters: datenExportParameters,
            wsParametersToString: wsParametersToString,
            wsParameterString: wsParameterString,
            wsURL: wsURL,
            ldbUser: ldbUser,
            ldbPassword: ldbPassword
        };
    }
}(angular.module('app.core')));

/**
 * Parameters and command parts for working with OrientDB
 */
module.exports = (function () {
    var
    // OrientDB database name
        //orientHost = 'h2258975.stratoserver.net',
        orientHost = 'localhost',
        orientDB = 'nkf',

    // OrientDB Server User and Password
        orientSUser = 'root',
        orientSPassword = 'arne',

    // OrientDB Database User and Password
        orientDBUser = 'admin',
        orientDBPassword = 'admin',

    // OrientDB Home directory
        orientHome = process.env.ORIENTDB_HOME,

    // Import Path used by ETL-Tool
        orientImportPath = process.cwd() + '/import',

    // Remote access to database
        //orientRemote = 'remote:h2258975.stratoserver.net/' + orientDB
        orientRemote = 'remote:' + orientHost + '/' + orientDB
        ;

    return {
        DB: orientDB,
        Home: orientHome,
        Host: orientHost,

        URL: orientHost + '/' + orientDB,

        Remote: orientRemote,

        DBUser: orientDBUser,
        DBPassword: orientDBPassword,
        // Blank are assumed by usage!
        DBUserPassword: ' ' + orientDBUser + ' ' + orientDBPassword + ' ',

        SUser: orientSUser,
        SPassword: orientSPassword,
        // Blank are assumed by usage!
        SUserPassword: ' ' + orientSUser + ' ' + orientSPassword + ' ',

        // OrientDB console cmd
        Console: orientHome + '/bin/console.sh ',
        // OrientDB ETL CLI
        Etl: orientHome + '/bin/oetl.sh ',
        // Connect to OrientDB: CONNECT <database-url> <user-name> <user-password>
        Connect: ' CONNECT ' + orientRemote + ' ' + orientDBUser + ' ' + orientDBPassword + ' ',

        ImportPath: orientImportPath
    }

})();
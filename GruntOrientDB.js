'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-shell');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        // NKF is intended to be a plugin for OrientDB.
        // Copy the (dist/)nkf subdirectory into the plugins dicretory of OrientDB.
        // Call nkf app with: http://localhost:2480/nkf/index.html#/
        dist: 'dist/nkf/www',
        // Import path
        importPath: process.cwd() + '/import'
    };

    /**
     * OrientDB Parameters and Commands (Blanks before [after] the vars is assumed by usage.)
     */
    var
    // OrientDB database name
        orientDB = 'test2',
    // OrientDB Home directory
        orientHome = process.env.ORIENTDB_HOME,
    // Remote access
        orientRemote = 'remote:/localhost/databases/' + orientDB,
    // OrientDB Server User and Password
        orientDBUser = 'root',
        orientDBPassword = 'arne',
        orientDBUserPassword = ' ' + orientDBUser + ' ' + orientDBPassword + ' ',
    // OrientDB console
        orientConsole = orientHome + '/bin/console.sh ',
    // OrientDB ETL CLI
        orientEtl = orientHome + '/bin/oetl.sh ',
    // Connect to OrientDB: CONNECT <database-url> <user-name> <user-password>
        orientConnect = ' CONNECT ' + orientRemote + ' admin admin ';

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,


        // Shell tasks to drop, create, create classes and load OrientDB
        shell: {
            options: {
                execOptions: {
                    maxBuffer: Infinity
                }
            },
            createDB: {
                command: orientConsole + '"create database ' + orientRemote + orientDBUserPassword + 'plocal"'
            },
            dropDB: {
                command: orientConsole + '"drop database ' + orientRemote + orientDBUserPassword + '"'
            },
            createPersonTypesClass: {
                command: orientConsole + '"' + orientConnect + ';' + grunt.file.read('./import/persons/create_PersonTypes_class.txt') + '"'
            },
            loadPersonTypes: {
                command: orientEtl + '<%= yeoman.importPath %>/persons/persontypes.json'
            },
            createPersonsClass: {
                command: orientConsole + '"' + orientConnect + ';' + grunt.file.read('./import/persons/create_Persons_class.txt') + '"'
            },
            loadPersons: {
                command: orientEtl + '<%= yeoman.importPath %>/persons/persons.json'
            },
            createProductTypesClass: {
                command: orientConsole + '"' + orientConnect + ';' + grunt.file.read('./import/products/create_ProductTypes_class.sql') + '"'
            },
            loadProductTypes: {
                command: orientEtl + '<%= yeoman.importPath %>/products/producttypes.json'
            },

            /**
             Accounting Framework

             An accounting framework is stored as a tree structure.
             The root node is the ID of the respective accounting framework.

             The hierarchy can be arbitrary. In the classical case, the levels are:
             1. Accounting framework (root node)
             2. Framework part (Balance sheet, income statement, financial statement)
             3. Account class
             4. Account group
             5. Account
             6. Sub-Account

             Kontenrahmen

             Ein Kontenrahmen ist als Baumstruktur gespeichert. Der Root-Knoten ist die ID des jeweiligen Kontenrahmens.

             Die Hierachie kann beliebig sein. Im klassischen Fall sind die Ebenen:
             1. Kontenrahmen
             2. (Bilanz, Ergebnisrechnung, Finanzrechnung)
             3. Kontenklasse
             4. Kontengruppe
             5. Konto
             6. Unterkonto
             */
            createFrameworkClass: {
                command: orientConsole + '"' + orientConnect + ';' + grunt.file.read('./import/accounting/createFrameworkClass.sql') + '"'
            },
            loadFramework: {
                command: orientEtl + '<%= yeoman.importPath %>/accounting/framework.json'
            },
            execSQLfile: {
                command: function (sqlfile) {

                    return orientConsole + '"' + orientConnect + ';' + grunt.file.read(sqlfile) + '"'
                }
            },
            loadData: {
                command: function(etlConfigFile) {
                    return orientEtl + '<%= yeoman.importPath %>' + etlConfigFile
                }
            }

        }
    });


    grunt.registerTask('default', [
        'orientDBcreateLoad'
    ]);

    grunt.registerTask('orientPlugin', 'Copy app into plugin directory of OrientDB', function () {
        grunt.task.run([
            'clean:orientPlugin',
            'copy:orientPlugin'
        ]);
    });

    grunt.registerTask('orientDBcreateLoad', 'Drop, create and load OrientDB', function () {
        grunt.task.run([
            'shell:dropDB',
            'shell:createDB',
            //'shell:createPersonTypesClass',
            //'orientLoadPersonTypes',
            //'shell:createPersonsClass',
            //'orientLoadPersons',
            //'shell:createProductTypesClass',
            //'orientLoadProductTypes',
            'shell:execSQLfile:./import/accounting/createFrameworkClass.sql',
            'orientLoadData:/accounting/framework.json:/accounting/financial_accounts.csv'
        ]);
    });

    /**
     * Change variable parameters in orient-etl config JSON-file.
     * @param {string} etlConfigFile = Path to etl JSON config file. Import path will be added.
     * @param {string} dataFile = Path to csv file containing the data to import. Import path will be added.
     * @param {string} orientURL = URL to destination OrientDB
     */
    grunt.registerTask('changeEtlConfig', 'Change variable parameters in orient-ETL config JSON-file.', function (etlConfigFile, dataFile) {
        var apJsonFile = appConfig.importPath + etlConfigFile;


        if (!grunt.file.exists(apJsonFile)) {
            grunt.log.error("file " + apJsonFile + " not found");
            return false;//return false to abort the execution
        }

        var etlJsonFile = grunt.file.readJSON(apJsonFile); //get file as json object

        etlJsonFile.source.file.path = appConfig.importPath + dataFile;
        etlJsonFile.loader.orientdb.dbURL = orientRemote;
        etlJsonFile.loader.orientdb.dbUser = orientDBUser;
        etlJsonFile.loader.orientdb.dbPassword = orientDBPassword;

        grunt.file.write(apJsonFile, JSON.stringify(etlJsonFile, null, 2));  //serialize it back to file
    });


    grunt.registerTask('orientLoadPersonTypes', 'Load Person Types (= legal entity types ) into Orient Database.', function () {

        grunt.task.run([
            'changeEtlConfig:/persons/persontypes.json:/persons/persontypes.csv',
            'shell:loadPersonTypes'
        ]);
    });

    grunt.registerTask('orientLoadPersons', 'Load Persons (= legal entities) into Orient Database.', function () {

        grunt.task.run([
            'changeEtlConfig:/persons/persons.json:/persons/persons.csv',
            'shell:loadPersons'
        ]);
    });

    grunt.registerTask('orientLoadProductTypes', 'Load Product Types (= product hierarchy ) into Orient Database.', function () {

        grunt.task.run([
            'changeEtlConfig:/products/producttypes.json:/products/producttypes.csv',
            'shell:loadProductTypes'
        ]);
    });

    grunt.registerTask('orientLoadFramework', 'Load Accounting Framework into Orient Database.', function () {

        grunt.task.run([
            'changeEtlConfig:/accounting/framework.json:/accounting/financial_accounts.csv',
            'shell:loadFramework'
        ]);
    });

    grunt.registerTask('orientLoadData', 'Load Data into Orient Database.', function (etlConfigFile, dataFile) {

        grunt.task.run([
            'changeEtlConfig:' + etlConfigFile + ':' + dataFile,
            'shell:loadData:' + etlConfigFile
        ]);
    });

};

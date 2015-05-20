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
    // Remote access to database
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
        },
        compress: {
            plugin: {
                options: {
                    archive: 'dist/nkf.zip'
                },
                files: [
                    // {src: ['path/*'], dest: 'internal_folder/', filter: 'isFile'}, // includes files in path
                    {
                        expand: true,
                        cwd: 'dist/nkf/',
                        src: ['**','!*.zip']
                    } // includes files in path and its subdirs
                    // {expand: true, cwd: 'path/', src: ['**'], dest: 'internal_folder3/'}, // makes all src relative to cwd
                    // {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
                ]
            },
            database: {
                options: {
                    archive: 'dist/nkfDatabase.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: orientHome + '/databases/' + orientDB + '/',
                        src: ['*'],
                        dest: 'nkf/'
                    }
                ]
            }
        }
    });


    grunt.registerTask('orientDBCreateAndLoad', [
        'orientDBCreate',
        'orientDBLoadData'
    ]);

    grunt.registerTask('orientPlugin', 'Copy app into plugin directory of OrientDB', function () {
        grunt.task.run([
            'clean:orientPlugin',
            'copy:orientPlugin'
        ]);
    });

    grunt.registerTask('orientDBCreate', 'Drop and create OrientDB database and classes.', function () {
        grunt.task.run([
            'shell:dropDB',
            'shell:createDB',
            'shell:execSQLfile:./import/persons/createPersonClasses.sql',
            'shell:execSQLfile:./import/products/createProductTypesClass.sql',
            'shell:execSQLfile:./import/accounting/createFrameworkClass.sql'
        ]);
    });

    grunt.registerTask('orientDBLoadData', 'Load data into OrientDB database.', function () {
        grunt.task.run([
            'orientLoadData:/persons/persontypes.json://persons/persontypes.csv',
            'orientLoadData:/persons/persons.json://persons/persons.csv',
            'orientLoadData:/products/producttypes.json:/products/producttypes.csv',
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

    grunt.registerTask('orientLoadData', 'Load Data into Orient Database with ETL tool.', function (etlConfigFile, dataFile) {

        grunt.task.run([
            'changeEtlConfig:' + etlConfigFile + ':' + dataFile,
            'shell:loadData:' + etlConfigFile
        ]);
    });

};

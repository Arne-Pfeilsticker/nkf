'use strict';

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
        dist: 'dist/nkf/www'
    };

    // Get OrientDB Parameters and Command parts
    var orient = require('./orientdb.config');

    var
    // OrientDB Home directory
        orientHome = process.env.ORIENTDB_HOME;

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
                //command: orient.Console + '"create database ' + orient.Remote + orient.SUserPassword + '"'
                command: orient.Console + '"create database ' + orient.Remote + orient.SUserPassword + 'plocal"'
            },
            dropDB: {
                command: orient.Console + '"drop database ' + orient.Remote + orient.SUserPassword + '"'
            },
            generateTimeline: {
                command: function () {

                    return orient.Console + '"' + orient.Connect + ';INSERT INTO Timeline (bookingYear) VALUES (2009),(2010),(2011),(2012),(2013),(2014),(2015),(2016),(2017),(2018)"'
                }
            },
            importServersideFunctions: {
                command: function (importfile) {

                    return orient.Console + '"' + orient.Connect + ';delete from OFunction;IMPORT DATABASE ' + orient.ImportPath + importfile + ' -merge=true"'
                }
            },
            exportServersideFunctions: {
                command: function (exportfile) {

                    return orient.Console + '"' + orient.Connect + ';EXPORT DATABASE ' + orient.ImportPath + exportfile + ' -includeClass=OFunction -includeInfo=false -includeClusterDefinitions=false -includeSchema=false -includeIndexDefinitions=false -includeManualIndexes=false"'
                }
            },
            execSQLfile: {
                command: function (sqlfile) {

                    return orient.Console + '"' + orient.Connect + ';' + grunt.file.read(sqlfile) + '"'
                }
            },
            loadData: {
                command: function(etlConfigFile) {
                    return orient.Etl + orient.ImportPath + etlConfigFile
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            orientPlugin: {
                options: {force: true},
                src: [orientHome + '/plugins/nkf']
            }
        },
        // Copies remaining files to places other tasks can use
        copy: {
            orientPlugin: {
                expand: true,
                cwd: 'dist',
                dest: orientHome + '/plugins',
                src: ['nkf/**/*.*']
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
                        cwd: orient.Home + '/databases/' + orient.DB + '/',
                        src: ['*'],
                        dest: 'nkf/'
                    }
                ]
            }
        }
    });


    grunt.registerTask('orientDBCreateAndLoad', [
        'orientDBCreate',
        'orientDBLoadData',
        'importServersideFunctions',
        'generateTimeline'
    ]);

    grunt.registerTask('orientPlugin', 'Copy app into plugin directory of OrientDB', function () {
        grunt.task.run([
            //'clean:orientPlugin',
            'copy:orientPlugin'
        ]);
    });

    grunt.registerTask('orientDBCreate', 'Drop and create OrientDB database and classes.', function () {
        grunt.task.run([
            'shell:dropDB',
            'shell:createDB',
            'shell:execSQLfile:./import/persons/createPersonClasses.sql',
            'shell:execSQLfile:./import/products/createProductTypesClass.sql',
            'shell:execSQLfile:./import/hierarchies/createHierarchiesClass.sql',
            'shell:execSQLfile:./import/accounting/createFrameworkClass.sql',
            'shell:execSQLfile:./import/accounting/createBookingsClass.sql',
            'shell:execSQLfile:./import/accounting/createTimelineClasses.sql'
        ]);
    });

    grunt.registerTask('orientDBLoadData', 'Load data into OrientDB database.', function () {
        grunt.task.run([
            'orientLoadData:/persons/persontypes.json:/persons/persontypes.csv',
            'orientLoadData:/persons/persons.json:/persons/persons.csv',
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
        var apJsonFile = orient.ImportPath + etlConfigFile;


        if (!grunt.file.exists(apJsonFile)) {
            grunt.log.error("file " + apJsonFile + " not found");
            return false;//return false to abort the execution
        }

        var etlJsonFile = grunt.file.readJSON(apJsonFile); //get file as json object

        etlJsonFile.source.file.path = orient.ImportPath + dataFile;
        etlJsonFile.loader.orientdb.dbURL = orient.Remote;
        etlJsonFile.loader.orientdb.dbUser = orient.SUser;
        etlJsonFile.loader.orientdb.dbPassword = orient.SPassword;

        grunt.file.write(apJsonFile, JSON.stringify(etlJsonFile, null, 2));  //serialize it back to file
    });

    grunt.registerTask('orientLoadData', 'Load Data into Orient Database with ETL tool.', function (etlConfigFile, dataFile) {

        grunt.task.run([
            'changeEtlConfig:' + etlConfigFile + ':' + dataFile,
            'shell:loadData:' + etlConfigFile
        ]);
    });

    grunt.registerTask('generateTimeline', 'Generate timeline data 2009 - 2018', function () {
        grunt.task.run([
            'shell:generateTimeline'
        ]);
    });

    grunt.registerTask('importServersideFunctions', 'Import all serverside js functions', function () {
        grunt.task.run([
            'shell:importServersideFunctions:/functions/functions.json.gz'
        ]);
    });

    grunt.registerTask('exportServersideFunctions', 'Export all serverside js functions', function () {
        grunt.task.run([
            'shell:exportServersideFunctions:/functions/functions.json.gz'
        ]);
    });

};

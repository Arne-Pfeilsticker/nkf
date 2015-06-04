/**
 * Definition of the server side functions
 */

module.exports = (function () {

    // OrientDB Parameters and Command parts
    var odb = require('../orientdb.config');

    var parseFn = require("parse-function");
    var Oriento = require('oriento');


    var server = Oriento({
        host: 'localhost',
        port: 2424,
        username: odb.SUser,
        password: odb.SPassword
    });

    var db = server.use({
        name: odb.DB,
        username: odb.DBUser,
        password: odb.DBPassword
    });
    console.log('Using database: ' + db.name);

    var fnName = '';

    /**
     * Create a OrientDB server side function from a plain Javascript function
     *
     * @param {String}  language    The language of the function [Javascript | SQL]
     * @param {Boolean} idempotent  [true|false]
     * @param {Object}  fn          Plain Javascript function to stringify
     *
     * This function ist only beause Oriento's createFn can't set parameter idempotent
     */
    var createServerside = function (language, idempotent, fn) {

        var lang = ' LANGUAGE ' + language.toLowerCase();
        var idem = ' IDEMPOTENT ' + (idempotent ? 'true' : 'false');

        var fnDef  = parseFn(fn);
        var params = "";
        fnName   = fnDef.name;
        var body   = fnDef.body
            .replace(/\'/g, "\\'")
            .replace(/\"/g, '\\"')
            .replace(/( {8})/g, '')
            .trim();

        if(fnDef.arguments.length > 0) {
            params = 'PARAMETERS ['+fnDef.params+']';
        }

        var fnExists = true;

        var createFunction = 'CREATE FUNCTION ' + fnName + ' \"' + body + '\"' + params + lang + idem ;

        // Delete function if exists.

        db.select('name')
            .from('OFunction')
            .where({name: fnName})
            .limit(1)
            .one()
            .then(function (params){
                if(params.name == fnName) {
                    console.log('Function ' + params.name + ' exists.');
                    fnExists = true;
                }
            })
            .catch(function(err) {
                console.log('Info: function ' + fnName + ' does not exist.');
                fnExists = false;
            })
            .done();

        if (fnExists) {
            db.delete()
                .from('OFunction')
                .where({name: fnName})
                .scalar()
                .then(function(total) {
                    console.log('Deleted', total, 'function');
                })
                .done();
        }

        db.exec(createFunction)
            .then(function (results){
                if(results.status.code == 0) {
                    console.log('Function ' + fnName + ' created successfully.');
                } else {
                    console.error('Error: Create function ' + fnName + ' faild.');
                    exit(1);
                }
            })
            .done();
    };

    var js = 'javascript',
        sql = 'sql';

    // Here the definition of server side functions begins.

    createServerside(js, true, function getAllUser() {
        var db = orient.getGraph();

        return db.command('sql', 'select from OUser');
    });


})();
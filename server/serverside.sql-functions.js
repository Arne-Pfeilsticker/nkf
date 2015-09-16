/**
 * Definition of the server side functions
 */

(function () {

    // OrientDB Parameters and Command parts
    var odb = require('../orientdb.config');

    var parseFn = require("parse-function");
    var Orientjs = require('../node_modules/orientjs/lib');
//    var Orientjs = require('orientjs');

    var server = Orientjs({
        // host: 'h2258975.stratoserver.net',
        host: odb.Host,
        port: 2424,
        httpPort: 2480,
        username: odb.SUser,
        password: odb.SPassword
    });

    //var db = server.use({
    //    name: odb.DB,
    //    username: odb.DBUser,
    //    password: odb.DBPassword
    //});

    var createDone = false;

    var db = server.use(odb.DB);
    console.log('Using database: ' + db.name);

 //   db.class.list()
 //       .then(function (results) {
 //           console.log('Existing Classes:', results);
 //           return db.class.create('TestClass');
 //       })
 //       .then(function (results) {
 //           console.log('Created Class:', results);
 //           return db.class.delete('TestClass');
 //       })
 //       .then(function (results) {
 //           console.log('Deleted Class');
 ////           process.exit();
 //       })
 //       .done();

    var fnName = '';

    /**
     * Create a OrientDB server side function from a plain Javascript function
     *
     * @param {String}  language    The language of the function [Javascript | SQL]
     * @param {Boolean} idempotent  [true|false]
     * @param {Object}  fn          Plain Javascript function to stringify
     *
     * This function ist only beause Orientjs's createFn can't set parameter idempotent
     */
    var createServerside = function (language, idempotent, fn) {

        var lang = ' LANGUAGE ' + language.toLowerCase();
        var idem = ' IDEMPOTENT ' + (idempotent ? 'true' : 'false');

        var fnDef = parseFn(fn);
        var params = "";
        fnName = fnDef.name;
        var body = fnDef.body;

        if (language == 'sql') {
            eval(body);
            body = cmd; // cmd variable contains the sql command
        } else {
            body.replace(/\'/g, "\\'")
                .replace(/\"/g, '\\"')
                .replace(/( {8})/g, '')
                .trim();
        }

        if (fnDef.arguments.length > 0) {
            params = 'PARAMETERS [' + fnDef.params + ']';
        }

        var fnExists = false;

        var createFunction = 'CREATE FUNCTION ' + fnName + ' \"' + body + '\"' + params + lang + idem;

        // Delete function if exists.
        //
        //db.select('name')
        //    .from('OFunction')
        //    .where({name: fnName})
        //    .limit(1)
        //    .one()
        //    .then(function (params) {
        //        if (params.name == fnName) {
        //            console.log('Function ' + params.name + ' exists.');
        //            fnExists = true;
        //        }
        //    })
        //    .catch(function (err) {
        //        console.log('Info: function ' + fnName + ' does not exist.');
        //        fnExists = false;
        //    })
        //    .done();
        //
        //if (fnExists) {
        //    db.delete()
        //        .from('OFunction')
        //        .where({name: fnName})
        //        .scalar()
        //        .then(function (total) {
        //            console.log('Deleted', total, 'function');
        //        })
        //        .done();
        //}

        //db.insert().into('OUser').set({name: 'demo', password: 'demo', status: 'ACTIVE'}).one()
        //    .then(function (user) {
        //        console.log('created', user);
        //    });

        db.exec(createFunction)
            .then(function (response) {
                if (response.status.code == 0) {
                    console.log('Function ' + fnName + ' created successfully.');
                } else {
                    console.error('Error: Create function ' + fnName + ' faild.');
                    exit(1);
                }
            })
            .catch(function (err) {
                console.log('Error: Create function ' + fnName + ' faild.');
                console.log(err);
            })
            .done(
            function () {
                if (createDone === true) {
                    db.close();
                    server.close();
                }
            }
        );
    };

    var js = 'javascript',
        sql = 'sql';

    // Here the definition of server side functions begins.

    createServerside(sql, true, function getFramework() {
        var cmd = "select $depth as treeLevel, out('hasSubaccount').size() as subaccounts, id, parent_id, label, shortcut, sign, breakdown, beneficiary, provider  from (traverse out('hasSubaccount') from (select from Framework where id = 'NKF05'))";
    });

    createServerside(sql, true, function persons_getTypes() {
        var cmd = "select $depth as treeLevel, out('hasPersonSubtype').size() as personsubtypes, id, parent_id, label, acronym from (traverse out('hasPersonSubtype') from (select from PersonTypes where id = 'pt'))";
    });

    createServerside(sql, true, function persons_getAll() {
        var cmd = "select $depth as treeLevel, out('hasPersons').size() as personsubtypes, id, parent_id, name, person_type, wiki_url, begin, end from (traverse out('hasPersons') from (select from Persons where id = 'de'))";
    });

    createDone = true;

})();
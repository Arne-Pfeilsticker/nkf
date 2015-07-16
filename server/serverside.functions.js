/**
 * Definition of the server side functions
 */

module.exports = (function () {

    // OrientDB Parameters and Command parts
    var odb = require('../orientdb.config');

    var parseFn = require("parse-function");
    var Orientjs = require('orientjs');


    var server = Orientjs({
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
     * This function ist only beause Orientjs's createFn can't set parameter idempotent
     */
    var createServerside = function (language, idempotent, fn) {

        var lang = ' LANGUAGE ' + language.toLowerCase();
        var idem = ' IDEMPOTENT ' + (idempotent ? 'true' : 'false');

        var fnDef  = parseFn(fn);
        var params = "";
        fnName   = fnDef.name;
        var body   = fnDef.body;

        if (language == 'sql') {
            eval(body);
            body = cmd; // cmd variable contains the sql command
        } else {
            body.replace(/\'/g, "\\'")
                .replace(/\"/g, '\\"')
                .replace(/( {8})/g, '')
                .trim();
        }

        if(fnDef.arguments.length > 0) {
            params = 'PARAMETERS ['+fnDef.params+']';
        }

        var fnExists = false;

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

    createServerside(sql, true, function getFramework() {
        var cmd = "select $depth as $$treeLevel, out('hasSubaccount').size() as subaccounts, id, parent_id, label, shortcut, sign, breakdown, beneficiary, provider  from (traverse out('hasSubaccount') from (select from Framework where id = 'NKF05'))";
    });

    createServerside(sql, true, function persons_getTypes() {
        var cmd = "select $depth as $$treeLevel, out('hasPersonSubtype').size() as personsubtypes, id, parent_id, label, acronym from (traverse out('hasPersonSubtype') from (select from PersonTypes where id = 'pt'))";
    });

    createServerside(sql, true, function persons_getAll() {
        var cmd = "select $depth as $$treeLevel, out('hasPersons').size() as personsubtypes, id, parent_id, name, person_type, wiki_url, begin, end from (traverse out('hasPersons') from (select from Persons where id = 'de'))";
    });

    createServerside(js, true, function importBookings() {
        /**
         * Insert Bookings and add edges to timeline and person
         **/

        var db = orient.getGraph();

        var data = JSON.parse(request.getContent()); // request payload
        var vt;
        var row, rowJSON,
            nkfAccount, // NKF account #
            accountId,  // Internal account # of the accounting framework
            accountV,   // current account vertex
            personV,    // Person vertex
            personId;   // Person Id (Gemeindekennzahl)

        var bookingYear,
            currentYear,
            yearV;      // Year vertex

        var toYearE,    // Edge to vertex timeline
            toPersonE;  // Edge to vertex person

// Just a way to get the current datetime
        var importDate = db.command('sql', 'select date() as importDate from OUser limit 1')[0].getProperty('importDate');;

// db.begin(); // Not a function of db!?

        try {
            for (var i = 0, len = data.length; i < len; i++ ) {
                row = data[i];

                rowJSON = JSON.stringify(row);

                vt = db.command('sql', 'insert into Bookings content ' + rowJSON );

                vt.setProperty('personId', 'de.' + row['personId'] );
                row['personId'] = vt.getProperty('personId');


                // Transform NKF account into internal account
                if (row['nkfAccount'] != nkfAccount) {

                    accountV = db.command('sql', 'select from Framework where nkf_account = ' + row['nkfAccount'] )[0];

                    if (accountV.getProperty('nkf_account') != row['nkfAccount']) {
                        db.rollback();
                        //response.send(500, "Error on creating new bookings", "text/plain", err.toString());
                        return 'Error: NKF-Account ' + row['nkfAccount'] + ' != ' + accountV.getProperty('nkf_account') + ' not in database. AccountV: ' + accountV.toString();
                    } else {

                        nkfAccount = accountV.getProperty('nkf_account');
                        accountId  = accountV.getProperty('id')

                    }

                }
                vt.setProperty('account', accountId);
                vt.setProperty('importDate', importDate);

                vt.save();

                // Get or create year vertex
                if (row['bookingYear'] != bookingYear) {

                    yearV = db.command('sql', 'select from Timeline where bookingYear = ' + row['bookingYear'] )[0];

                    if (typeof yearV === 'undefined') {

                        yearV = db.command('sql', 'insert into Timeline set bookingYear = ' + row['bookingYear'] );

                        bookingYear = yearV.getProperty('bookingYear');

                    }
                }

                // Create Edges to Timeline and Persons
                toYearE = db.addEdge(null, vt, yearV, 'toBookingYear');

                // Get person vertex
                if (vt.getProperty('personId') != personId) {

                    personV = db.command('sql', 'select from Persons where id = "' + row['personId'] + '"' )[0];

                    //return personV;

                    if (typeof personV === 'undefined' || personV.getProperty('id') != row['personId']) {
                        db.rollback();
                        //response.send(500, "Error on creating new bookings", "text/plain", err.toString());
                        return 'Error: NKF-Person-Id ' + row['personId'] + ' != ' + personV.getProperty('id') + ' not in database. PersonV: ' + personV.toString();
                    } else {

                        personId  = personV.getProperty('id')

                    }

                }
                toPersonE = db.addEdge(null, vt, personV, 'toPerson');

            }
        } catch (err) {
            db.rollback();
            //response.send(500, "Error on creating new bookings", "text/plain", err.toString());
            return err;
        }

        db.commit();
        return vt;

    });

})();
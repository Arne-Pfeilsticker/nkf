/**
 * Definition of the server side js functions
 */

module.exports = (function () {

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

    var db = server.use(odb.DB);
    console.log('Using database: ' + db.name);

    // Here the definition of server side functions begins.

    db.createFn(function getAllUser() {
        var db = orient.getGraph();

        return db.command('sql', 'select from OUser');
    })
        .then(function(count) {
        console.log("Function getAllUser created. Count: " + count)
    });

    db.createFn(function importBookings() {
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
        var importDate = db.command('sql', 'select date() as importDate from OUser limit 1')[0].getProperty('importDate');

        // db.begin(); // Not a function of db!?

        try {
            for (var i = 0, len = data.length; i < len; i++) {
                row = data[i];

                rowJSON = JSON.stringify(row);

                vt = db.command('sql', 'insert into Bookings content ' + rowJSON);

                vt.setProperty('personId', 'de.' + row['personId']);
                row['personId'] = vt.getProperty('personId');


                // Transform NKF account into internal account
                if (row['nkfAccount'] != nkfAccount) {

                    accountV = db.command('sql', 'select from Framework where nkf_account = ' + row['nkfAccount'])[0];

                    if (accountV.getProperty('nkf_account') != row['nkfAccount']) {
                        db.rollback();
                        //response.send(500, "Error on creating new bookings", "text/plain", err.toString());
                        return 'Error: NKF-Account ' + row['nkfAccount'] + ' != ' + accountV.getProperty('nkf_account') + ' not in database. AccountV: ' + accountV.toString();
                    } else {

                        nkfAccount = accountV.getProperty('nkf_account');
                        accountId = accountV.getProperty('id')

                    }

                }
                vt.setProperty('account', accountId);
                vt.setProperty('importDate', importDate);

                vt.save();

                // Get or create year vertex
                if (row['bookingYear'] != bookingYear) {

                    yearV = db.command('sql', 'select from Timeline where bookingYear = ' + row['bookingYear'])[0];

                    if (typeof yearV === 'undefined') {

                        yearV = db.command('sql', 'insert into Timeline set bookingYear = ' + row['bookingYear']);

                        bookingYear = yearV.getProperty('bookingYear');

                    }
                }

                // Create Edges to Timeline and Persons
                toYearE = db.addEdge(null, vt, yearV, 'toBookingYear');

                // Get person vertex
                if (vt.getProperty('personId') != personId) {

                    personV = db.command('sql', 'select from Persons where id = "' + row['personId'] + '"')[0];

                    //return personV;

                    if (typeof personV === 'undefined' || personV.getProperty('id') != row['personId']) {
                        db.rollback();
                        //response.send(500, "Error on creating new bookings", "text/plain", err.toString());
                        return 'Error: NKF-Person-Id ' + row['personId'] + ' != ' + personV.getProperty('id') + ' not in database. PersonV: ' + personV.toString();
                    } else {

                        personId = personV.getProperty('id')

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

    })
        .then(function(count) {
        console.log("Function importBookings created. Count: " + count)
    });

    db.createFn(function framework_delete() {
        var db = orient.getGraph();
        var result = db.command('sql', 'delete Edge hasSubaccount');
        result = db.command('sql', 'delete Vertex Framework');

        return result;
    })
        .then(function(count) {
            console.log("Function framework_delete created. Count: " + count)
        });

    db.createFn(function framework_import() {
        /**
         * Import Framework and add edges for framework hierarchy.
         **/

        var db = orient.getGraph();

        var data = JSON.parse(request.getContent()); // request payload
        var vt;
        var hierarchyJSON, hierarchyV;
        var row, rowJSON,
            id,        // Framework id
            parentV,   // Parent vertex
            parent_id, parentId;  // parent id

        var hasSubaccount;  // Edge to build hierarchies of accounts

        // db.begin(); // Not a function of db!?

        try {
            for (var i = 0, len = data.length; i < len; i++) {

                //row: id;parent_id;breakdown;sign;nkf_account;label;shortcut;beneficiary;provider
                row = data[i];

                rowJSON = JSON.stringify(row);

                vt = db.command('sql', 'insert into Framework content ' + rowJSON);

                // Get parent vertex

                parentId = vt.getProperty('parent_id');

                if (parentId != null) {

                    if (parentId != parent_id) {

                        parentV = db.command('sql', 'select from Framework where id = "' + parentId + '"')[0];

                        //return parentV;

                        if (typeof parentV === 'undefined' || parentV.getProperty('id') != parentId) {
                            db.rollback();
                            //response.send(500, "Error on creating new Framework", "text/plain", err.toString());
                            return 'Error: NKF-Framework Parent-Id ' + parentId + ' != ' + parentV.getProperty('id') + ' not in database. parent vertex: ' + parentV.toString();
                        } else {

                            parent_id = parentV.getProperty('id')

                        }
                    }
                    hasSubaccount = db.addEdge(null, parentV, vt, 'hasSubaccount');

                } else { // Root node: Insert or update entry in class Hierarchies

                    /**
                     * Each Hierarchy gets an entry in the Hierarchies class.
                     * The data are derived form the root node.
                     */

                    id = vt.getProperty('id');

                    hierarchyV = db.command('sql', 'select from Hierarchies where hierarchy_id = "' + id + '"')[0];

                    //return hierarchyV;

                    if (typeof hierarchyV === 'undefined' || hierarchyV.getProperty('hierarchy_id') != id) {

                        hierarchyV = {};
                        hierarchyV['hierarchy_id'] = vt.getProperty('id');
                        hierarchyV['class'] = vt.getProperty('@class');
                        hierarchyV['root_rid'] = vt.getProperty('@rid');
                        hierarchyV['label'] = vt.getProperty('label');
                        hierarchyV['shortcut'] = vt.getProperty('shortcut');

                        hierarchyJSON = JSON.stringify(hierarchyV);

                        hierarchyV = db.command('sql', 'insert into Hierarchies content ' + hierarchyJSON);

                    } else { // update hierarchy entry

                        hierarchyV.setProperty('hierarchy_id', importDate);

                        hierarchyV.setProperty('hierarchy_id', vt.getProperty('id'));
                        hierarchyV.setProperty('class', vt.getProperty('@class'));
                        hierarchyV.setProperty('root_rid', vt.getProperty('@rid'));
                        hierarchyV.setProperty('label', vt.getProperty('label'));
                        hierarchyV.setProperty('shortcut', vt.getProperty('shortcut'));

                        hierarchyV.save();
                    }
                }
            }
        } catch (err) {
            db.rollback();
            //response.send(500, "Error on creating new Framework", "text/plain", err.toString());
            return err;
        }

        db.commit();
        return vt;

    })
        .then(function(count) {
            console.log("Function framework_import created. Count: " + count)
        });

})();
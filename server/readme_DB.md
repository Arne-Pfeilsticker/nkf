# Database notes

## Configuration

### Speed up DB during development

Shut off [PLocal WAL (Journal)] (http://orientdb.com/docs/last/Write-Ahead-Log.html) in orientdb-server-config.xml. Add:
    
    <properties>
        <!-- Custom settings for development -->
        <entry name="storage.useWAL" value="false" />
		<entry name="storage.wal.path" value="/Volume/Daten/OrientDBwal" />
    </properties>
    
### Cross-Origin Resource Sharing (CORS) problems

Add this entry in config/orientdb-server-config.xml

    <parameter name="network.http.additionalResponseHeaders" 
               value="Access-Control-Allow-Origin: * ;Access-Control-Allow-Credentials: true;Access-Control-Allow-Headers: Content-Type;Access-Control-Allow-Methods: POST, GET, DELETE, HEAD, OPTION" />

above

    <parameter value="utf-8" name="network.http.charset"/>
    
# Server-Side Functions

## Database Graph-API for server-side functions

    var db = orient.getGraph();      // with transactions
    var db = orient.getGraphNoTx();  // without transaction for more speed

To explore the database class you can write a simple function, orientClass, without parameter.

    return orient.getClass();

The result of the function execution is:

    [
        {
            "@type": "d",
            "@version": 0,
            "value": "class com.orientechnologies.orient.graph.script.OScriptGraphOrientWrapper"
        }
    ]

As you see, the functions is referencing a Java class directly. The java class that the orient variable wraps is OScriptGraphOrientWrapper. 
Thus, in case you want to know more about its methods you can invoke just view the 
[OScriptGraphOrientWrapper] (http://orientdb.com/javadoc/latest/com/orientechnologies/orient/graph/script/OScriptGraphOrientWrapper.html) javadoc.

The methods to work with you find on the Graph wrapper class to use from scripts: 
 [OScriptGraphWrapper] (http://orientdb.com/javadoc/latest/com/orientechnologies/orient/graph/script/OScriptGraphWrapper.html)
 
### Test 

Sometimes no error message are given. In this cases curl helps:

    curl -X GET -u "admin:admin" http://localhost:2480/function/nkf/personTypes_getTree
    
# Snippets

Create edge when edge to PersonTypes is missing.

    create edge isPersonType from (select from Persons where out_isPersonType is null or out_isPersonType.size() = 0) to #11:17
    
    create edge isPersonType from (select from Persons where person_type = 'Bund' and ( out_isPersonType is null or out_isPersonType.size() = 0)) to (select from PersonTypes where label = 'Bund')
    
    out_isPersonType is null means: out_isPersonType is not an attribute of Persons vertex.
    out_isPersonType.size() = 0 means: out_isPersonType is attribute of Persons vertex, but it is empty.
    
Remove property out_isPersonType when edge is empty:

    update V remove out_isPersonType where out_isPersonType.size() = 0
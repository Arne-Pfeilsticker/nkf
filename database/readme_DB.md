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
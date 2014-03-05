## Using the server

### Start the server

To start the mock server, execute the following command:

    $ node server/server.js

This will start a web server, which will listen on the localhost, and the port specified in the `config.yml` file (3007 by default).

After starting the server, you can can try it with a browser, or the `curl` command line tool:

    $ curl http://localhost:3007/rest/monitoring/isAlive
    true


### Use as static mock server
TBD.

### Use as static content provider of docs and webui
TBD.

### Implement dynamic mocking behaviour

In the `service.yml` file, every method's `request` object can have an optional property, which can identify an implementation function in the following format: `<module>.<function>`.

In order to use this feature, you must have a module written in JavaScript placed into the `server` folder named `<module>.js`, which contains an exported function with the name of `<function>`. For example the following file is named `monitoring.js` and contains the implementation of the response logic which will be called when the referring method is activated:

    function isAlive( request, response, serviceDescriptor )
    {
        response.header( 'Content-Type', 'application/json' );
        response.header( 'X-Application-API-Version', 'v0.0.0' );

        response.write( 'true' );
        response.end( '\n' );
    };

    exports.isAlive = isAlive;

As you can see, the function gets all the request parameters, as well as the response object, which is used to compose the response.

In order to be able to behave the expected way, the function gets a third parameter (`serviceDescriptor`), which holds all the data found in the corresponding `service.yml` file. This object also provides methods to access to the mock files situated beside the service descriptor.

<!-- Add link to the rest-tool-common documentation pages, and the express.js pages -->

### Use the proxy
TBD.


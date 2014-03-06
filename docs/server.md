## Using the server

### The mock server configuration

By default the tool creates the mock server into the `server` subfolder under the project root.

The original setup is the following:

    server/
    ├── api.js
    ├── config.js
    ├── config.yml
    ├── monitoring.js
    ├── package.json
    ├── Readme.md
    └── server.js

Where

- __Readme.md__  
  A short readme file about how to use the server.

- __server.js__  
  The mock server itself.

- __config.yml__  
  Configuration parameters of the mock server.

- __config.js__  
  Helper module to load the configuration parameters.

- __package.json__  
  Module dependencies of the server. By default this file contains all the required dependencies, but the `package.json` file in the parent folder also contains them, so you do not need to install them in the server's folder, because it will access them from it parent's `node_modules` folder.

  You can extend this file, if you need additional modules installed to implement dynamic behaviour. In this case you have changed this file, you have install the packages, so run the `npm install` command in the server folder.

- __api.js__  
  A boilerplate modul to implement your own implementation functions. If you want to implement only a couple a functions, it is enough to define them in this module, and just refer to them. In case of more complex logic, you'd better create your own modules.

- __monitoring.js__  
  A sample module, which demonstrates how an implementation should be written.

In a newly created API project the server is configured to work immediatly. The default `config.yml` looks like this:

    # Use this environment by default,
    # if server is started without the --env switch.
    useEnvironment: development
    #useEnvironment: production

    environments:

      # This is the default configuration set
      default:
        documentRoot: .
        port: 3007
        restapiRoot: ..
        useRemoteServices: false

      # Override the default config parameters
      # with values specific to the development environment
      development:
        port: 3007
        documentRoot: ../webui

      # development environment with proxying the 'serviceUrlPrefix' requests to the local host
      devProxy:
        port: 3006
        documentRoot: ../webui
        useRemoteServices: true
        remoteHost: localhost
        remotePort: 3008

      # production environment specific values
      production:
        port: 3008
        documentRoot: ../webui/build/crm-api/production


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

<!-- TODO:
    - Add link to the
        - rest-tool-common documentation pages,
        - express.js pages
        - relevant cookbook examples
 -->

### Use the proxy
TBD.


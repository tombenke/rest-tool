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

In a newly created API project the server is configured to work immediately. The default `config.yml` looks like this:

    # Use this environment by default,
    # if server is started without the <env> parameter
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

in general the configuration file can contain any property, but should contain at leas two mandatory properties. These are: `environments` and `useEnvironment`.

The configuration parameters are grouped into _environments_ which are described under the `environments` array propery. Each _environment_ is identified by its name and describe a  specific server configuration. The configuration file must define at least one _environment_, that is the __default__.

The `useEnvironment` tells the server that which environment should be used by default, if it was not specified explicitly when the it is started.

An environment usually has the following configuration properties:

- __documentRoot:__
  (string)
  Defines the path to the folder, which is used as the document root to the static content provided by the server. This content can be anything: static HTML pages, Fontend JavaScript application (Backbone, ExtJs, etc.), or anything.
  For example: ../webui

- __port:__
  _(integer)_  
  The port where the server is listening.
  For example: 3007

- __restapiRoot:__
  _(string)_  
  Path of the project root folder. server needs this in order to be able to access to the service descriptions and mock data files.
  For example: ..

- __useRemoteServices:__
  _(boolean)_  
  If true, the server acts as a proxy server, and forwards the serivce requests to a nremote host. It is false by default.
  For example:  false

- __remoteHost:__
  _(string)_  
  The host name of the remote host. Used only if the server is in proxy mode (`useRemoteServices: true`).
  For example: localhost

- __remotePort:__
  _(integer)_  
  The port of remote host. Used only if the server is in proxy mode (`useRemoteServices: true`).
  For example: 3008

Beside the parameters listed above, you can add further ones to the config file, if you want to extend the funcionalities of the server.

### Start the server

To start the mock server with the default configuration, execute the following command:

    $ node server/server.js

This will start a web server, which will listen on the localhost, and the port specified in the `config.yml` file (3007 by default).

After starting the server, you can can try it with a browser, or the `curl` command line tool:

    $ curl http://localhost:3007/rest/monitoring/isAlive
    true

If you want to start the server with an other configuration (`devProxy` for example), define it as a parameter in the following format:

    $ node server/server.js devProxy

    { documentRoot: '../webui',
      port: 3006,
      restapiRoot: '..',
      useRemoteServices: true,
      environment: 'devProxy',
      remoteHost: 'localhost',
      remotePort: 3008 }
    restapi config: { projectName: 'crm-api',
      apiVersion: 'v0.0.0',
      author: 'TBD.',
      licence: 'TBD.',
      serviceUrlPrefix: '/rest',
      servicePort: 3007,
      baseUrl: 'http://localhost:3007/rest',
      servicesRoot: 'services',
      services: [ '/monitoring/isAlive', '/customers' ],
      loginCredentials: { user: 'username', pass: 'password' } }
    register service GET /monitoring/isAlive
    /monitoring/isAlive
    register service GET /customers
    /customers
    register service POST /customers
    /customers
    Express server listening on port 3006 in devProxy mode

As you can see, the server is listening now on port 3006, and proxying the HTTP requests to the `localhost:3008`.

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


## Using the server

### The mock server configuration

By default the tool creates the mock server into the `server` sub-folder under the project root.

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

  You can extend this file, if you need additional modules installed to implement dynamic behavior. In this case you have changed this file, you have install the packages, so run the `npm install` command in the server folder.

- __api.js__  
  A boilerplate module to implement your own implementation functions. If you want to implement only a couple a functions, it is enough to define them in this module, and just refer to them. In case of more complex logic, you'd better create your own modules.

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
        remoteServices: []

      # Override the default config parameters
      # with values specific to the development environment
      development:
        port: 3007
        documentRoot: ../webui

      # development environment with proxying the 'serviceUrlPrefix' requests to the local host
      devProxy:
        port: 3006
        documentRoot: ../webui
        remoteServices:
          -
            uri: /monitoring
            active: true
            host: localhost
            port: 3007
          -
            uri: /*
            active: true
            host: localhost
            port: 3008

      # production environment specific values
      production:
        port: 3008
        documentRoot: ../webui/build/crm-api/production

In general the configuration file can contain any property, but should contain at leas two mandatory properties. These are: `environments` and `useEnvironment`.

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

- __remoteServices:__
  _(Array)_  
  An array of server-side forwarding rules used by the proxy middleware. If the proxy middleware is used, it iterates through this array, and try to match the requested URI with the `uri` property of each item of this array. Each rule contains the following properties: __active__, __uri__, __host__ and __port__ respectively. These properties are described below. The itema are matched in order, and the first matching `uri` will be used. If none of the `uri` is matching, then no forwarding happens.

- __uri:__
  _(boolean)_  
  A regular expression which fully or partially matches an existing service defined under the `services` folder. For example: `/monitoring/isAlive` identifies exactly one service. `/monitoring/*` stands for any service starting with `/monitoring/`. `/*` means _all services_.

- __active:__
  _(boolean)_  
  If true, the server acts as a proxy server, and forwards the service requests to a remote host.
  For example:  false

- __host:__
  _(string)_  
  The host name of the remote host. Used only if the server is in proxy mode with the given service (`uri` matches and `active: true`).
  For example: localhost

- __port:__
  _(integer)_  
  The port of remote host. Used only if the server is in proxy mode with the given service (`uri` matches and `active: true`).
  For example: 3008

Beside the parameters listed above, you can add further ones to the config file, if you want to extend the functionalities of the server.

### Start the server

To start the mock server with the default configuration, execute the following command:

    $ node server/server.js

This will start a web server, which will listen on the localhost, and the port specified in the `config.yml` file (3007 by default).

After starting the server, you can can try it with a browser, or the `curl` command line tool:

    $ curl http://localhost:3007/rest/monitoring/isAlive
    true

If you want to start the server with an other configuration (`devProxy` for example), define it as a parameter in the following format:

    $ node server/server.js devProxy


    register service GET /monitoring/isAlive
    /monitoring/isAlive
    register service GET /customers
    /customers
    register service POST /customers
    /customers
    Express server listening on port 3006 in devProxy mode

As you can see, the server is listening now on port 3006, and proxying the HTTP requests to the `localhost:3008`.

### Use as static mock server

The following code fragment shows how the middle-ware is configured for the mock server: 

    // Configure the middle-wares
    server.configure( function() {
            server.use( proxy(servicesConfig.serviceUrlPrefix, config.remoteServices) );
            server.use( express.bodyParser() );
            server.use( express.methodOverride() );
            server.use( express.cookieParser() );
            server.use( express.session( {secret: 'keyboard cat'} ) );
            server.use( server.router );
            server.use( '/data', express.static( __dirname + '/' + '../data' ) );
            server.use( '/docs', express.static( __dirname + '/' + '../docs' ) );
            server.use( '/services', express.static( __dirname + '/../services' ) );
            server.use( express.static( __dirname + '/' + config.documentRoot ) );
        });

The order of processing is the following:
1. `server.use(proxy(servicesConfig.serviceUrlPrefix, config.remoteServices));`  
   The middleware catches every incoming call, and check the URL prefix with the requested URL against each item in the `config.remoteServices` array. If any one of them is matching, and the proxying is activated with that matching `uri`, then forwards the request to the `remoteService.host:remoteService.port`. In other words, every matching service call is proxied to the remote server.
2. `server.use(server.router);`  
   This is the next level of processing in order. When the server starts, it loads and registers all the services to the `server.router`, so  in this phase the service are provided on the normal way, if the proxy is not enabled.
3. `server.use('/data', express.static(__dirname + '/' + '../data'));`  
   The static content of the `<project-root>/data` folder is provided by this middle-ware. You can place additional data files into this folder. 
4. `server.use('/docs', express.static(__dirname + '/' + '../docs'));`  
   The static content of the `<project-root>/docs` folder is provided by this middle-ware. Actually this is the HTML format documentation, generated by the `rest-tool docs --update` command. So you can read it off-line and on-line as well, provided by the mock server itself.
5. `server.use('/services', express.static(__dirname + '/../services'));`  
   The static content of the `<project-root>/services` folder is provided by this middle-ware. These are the folders that describe the services, and contain the additional mock data and other files. In normal cases you do not need this, however you might want to write special service modules, that might want to access these files through HTTP requests.
6. `server.use(express.static(__dirname + '/' + config.documentRoot));`  
  This is a middle-ware which provides the static content from the directory, that is identified by the `documentRoot` config parameter. Typically it points to the source, or distribution folder of the  the front-end application under development.

### Use as static content provider

As it is described in the previous section, the HTTP middle-ware is configured to process the incoming request in the following order:
1. Catches and forwards the service calls to remote host if proxying is enabled.
2. Handling and serving service calls according to the URL patterns described in the `service.yml` files.
3. Providing static content from several folders, such as `docs`, `data`, etc.

The the mock server is providing generated documentation by default. You also can configure a so called _document root_ folder, for your web UI.  

The next setup is typical for a UI development project:
1. Create a REST API project into a dedicated folder, an usually a dedicated repository (git, mercurial, etc.). Place your service descriptions and mock data here.
2. Create an other, dedicated folder for the UI development (ExtJS, Backbone, AngularJS, etc.) and configure the mock server to provide this as static content, using the `documentRoot` configuration parameter.
3. Develop your server implementation in a third place.

### Implement dynamic mocking behavior

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

The mock server implementation is built on top of the [express.js](http://expressjs.com) web framework. In order to learn more about how to use the [`request`](http://expressjs.com/3x/api.html#req.params) and [`response`](http://expressjs.com/3x/api.html#res.status) parameters, visit its [API documentation pages](http://expressjs.com/3x/api.html).

> Note that you have to export those functions you would like to use externally. This is done by the `exports.isAlive = isAlive;` line of the code fragment above.

> You must add a line to the `server.js` which tells the server to load this module when starts. In case of the previous example the following line must be added:

    var monitoring = require('./monitoring.js');

If you are not familiar with how to create [modules](http://nodejs.org/api/modules.html), and how to use `exports`, etc. read the [Node.js documentation](http://nodejs.org/api/).

The `rest-tool` creates the following empty extension module with the new project that is called `api.js`.

    /**
     * Implementation of method calls defined in `service.yml` files
     * This file is generated by the rest-tool tool.
     */
    var services = require('rest-tool-common').services;

    var server = require('./server.js');

    //=============================================================================
    // Put your mock method implementations here

In case you only want to add a couple of simple function, and do not want to bother with creating ad `require`-ing your own module, you should just simple define these functions in this `api.js` (export the functions), and refer to them from the `service.yml` files, with the `implementation` property. This server is loading this `api.js` by default, so you do not need to modify that.

<!-- TODO:
    - Add link to the:
        - rest-tool-common documentation pages,
        - relevant cookbook examples
 -->

### Use the proxy

It is very likely that your server implementation will be written in a different language, not in JavaScript, and developed by an other team. 

However one of the advantages of using __rest-tool__ is to let the development teams working parallel with each other, you have to integrate your front-end with the back-end, for several reasons, but the most obvious one is, to see how the two parts work together, and do bug-fixing.

In such situations you need your independent front-end environment as well as you should be able to connect to the real implementation instead of the mock server. For security reasons, in such cases you usually should deploy your front-end to the application server, that can be rather time consuming. This is the case, when the proxy comes into the picture. You can continue using your mock server as static content provider, to load your front-end application, but you can switch on its proxy function to forward the service calls to a remote server, that is the application server your front-end should be tested with.

In order to use this feature, create a configuration of the server (according to the [The mock server configuration](server.html#the-mock-server-configuration) section) to enable the proxy function that forwards the requests to the test application server, and continue using the mock to provide its static content that you have been used so far for development. This way, you can connect to the real, or test application server without the long-lasting deployment process, and easily switch back and forth between the mock and the other back-end implementation.

Using an array of forwarding rules, it is possible to proxy different services toward differend servers. For example you can use the original mock server to provide the frontend code under development provided as static content directly by the mock server. Then you an also provide some basic REST services also by the mock server (`/monitoring/isAlive`, etc.). At the same time you can add some rules to forward the REST calls to an other Node.js, PHP or JEE backend server. Moreover you can add an other proxy rule to forward REST calls to a third party messaging middleware (RabbitMQ, HornetQ, etc.).

You can individually enable/disable the forwarding of each service call, using the `active` field in the configuration. This way, you can first use the mock services, until the final implementation gets ready to use. Then you can switch out to the real backend service one-by-one.
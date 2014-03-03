# Get Started

## Installation

### Preprequisites:

`rest-tool` needs [Node.js](http://nodejs.org/) and [NPM](https://npmjs.org/) installed on the machine, before start installing and using it.

If you want to change the stylesheets of the generated documentation of the API, you will need [Sass](http://sass-lang.com/) and [Compass](http://compass-style.org/).


### Installation steps

The `rest-tool` tool can be installed as any other node module, but you have to install to the global node_modules folder, so use the `-g` switch to `npm`.

To install `rest-tool`, execute the following command:

    $ npm install -g rest-tool

To check, whether rest-tool is installed successfully, run the following command:

    $ rest-tool -V
    0.4.5


## Usage of the `rest-tool` utility

To get help, use the `-h` option:

rest-tool -h

  Usage: rest-tool [options] [command]

  Commands:

    create [options] <project-name> Create a new REST API project
    docs [options]         Documentation management
    add [options]          Add new service to the project
    add-bulk [options]     Add new services to the project in bulk mode
    test [options]         Test cases management

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

You can do the following things with `rest-tool`:

- Create a new REST API project (`rest-tool create`).
- Create services for the API (`rest-tool add`, `rest-tool add-bulk`).
- Generate/Update the HTML format documentation (`rest-tool doc --update`)
- Generate/Update the test cases (`rest-tool test --update`)
- Use the mock Node.js server for testing, and simulating of the REST API functionality (`node server/server.js`).

You can get help to any of the commands using the following schema:

    $ rest-tool <command> -h

for example:

    $ rest-tool docs -h

      Usage: docs [options]

      Options:

        -h, --help                     output usage information
        -u, --update                   Generate the HTML format documentation
        -c, --config <configFileName>  The name of the configuration file (default: config.yml)
        -v, --verbose                  Verbose mode

The following sections describe the usage of the commands in details.

## Create your first REST API project

Create the project:

### Generate a new REST API project:

    $ rest-tool create <project-name>

for example:

    $ rest-tool create crm-api


### Install the required node modules for the project

After, you have created the new project, move into the new projects folder,
and install those node modules, the new project needs:

    $ cd crm-api
    $ npm install

### Start the mock server

Start the mock server from the console:

    $ node server/server.js 

The server starts and should write something like this:

    { documentRoot: '../webui',
      port: 3007,
      restapiRoot: '..',
      useRemoteServices: false,
      environment: 'development' }
    restapi config: { projectName: 'crm-api',
      apiVersion: 'v0.0.0',
      author: 'TBD.',
      licence: 'TBD.',
      serviceUrlPrefix: '/rest',
      servicePort: 3007,
      baseUrl: 'http://localhost:3007/rest',
      servicesRoot: 'services',
      services: [ '/monitoring/isAlive' ],
      loginCredentials: { user: 'username', pass: 'password' } }
    register service GET /monitoring/isAlive
    /monitoring/isAlive
    Express server listening on port 3007 in development mode

As you can see, the server is running, and listening on 3007 port.
It uses a base URL that is: `http://localhost:3007/rest` and 
the `/monitoring/isAlive` service is already registered.
It is a predefined service which can be used as an example for defining new services
as well as it provides a service that immediately should work, and makes easier the troubleshooting if something is wrong with the creation of the project.

You can see its descriptor under the `services` folder:

    services/
    └── monitoring
        └── isAlive
            └── service.yml


Try to call this service with a browser or a command line utility, and you should get 
a `true` value as a response:

    $ curl http://localhost:3007/rest/monitoring/isAlive
    true


### Run the tests to check if the server is working properly

Open a new terminal, then go into the newly created 'crm-api' project folder,
and generate the test cases using the 'rest-tool':

    $ rest-tool test --update
    Update test cases or create them, if they are missing.
    Existing files will not be overwritten

A new test case should be generated under the 'test' folder, based on the
'templates/test/testDelMethod.mustache' template.

Check whether a test case is really there:

    $ tree test/
    test/
    └── Get Monitoring Is Alive.js

    0 directories, 1 file

Run the test case to make sure, it is working:

    $ mocha

      .

      ✔ 1 tests complete (24ms)

You can also do it via make:

    $ make test


      Successfully checks if server is alive
        ✓ should Successfully checks if server is alive 


      1 passing (22ms)

### Generate the HTML format documentation

Generate the documentation for the predefined service with the following command:

    $ rest-tool docs --update

The following files will be generated:

    $ tree docs
    docs
    ├── images
    │   └── grid.png
    ├── index.html
    ├── js
    │   ├── jquery-1.9.0
    │   │   ├── jquery-1.9.0.js
    │   │   └── jquery-1.9.0.min.js
    │   └── restapidoc.js
    ├── README.md
    ├── sass
    │   ├── ie.scss
    │   ├── partials
    │   │   └── _base.scss
    │   ├── print.scss
    │   └── screen.scss
    ├── services
    │   └── monitoring
    │       └── isAlive
    │           ├── service.html
    │           └── service.yml
    └── stylesheets
        ├── ie.css
        ├── print.css
        └── screen.css

    9 directories, 15 files


Now you can view the generated documentation with a browser either as a static content 
opening the `docs/index.html` or through the server using the `http://localhost:3007/docs/` URL.

### Create your first service

Create a collection manager service with the following command:

    $ rest-tool add -t COLLECTION \
        -p customers \
        -u /customers \
        -n Customers \
        -d "A service to manage the collection of customers"

And check what is created under the services folder:

    $ tree services/
    services/
    ├── customers
    │   ├── getCollection-responseBody.json
    │   ├── postCollection-requestBody.json
    │   ├── postCollection-responseBody.json
    │   └── service.yml
    └── monitoring
        └── isAlive
            └── service.yml

    3 directories, 5 files

Add the newly created server to the `services` list in the `config.yml` file:

    projectName: crm-api
    apiVersion: v0.0.0
    author: TBD.
    licence: TBD.
    serviceUrlPrefix: /rest
    servicePort: 3007
    baseUrl: http://localhost:3007/rest
    servicesRoot: services
    services:
        - /monitoring/isAlive
        - /customers # Add this entry!!!
        # To add new services,put here the path of
        # the directory that contains the service.yml

    loginCredentials:
        user: username
        pass: password

Then you should __restart the server__, and the service is working with the predefined settings and mock data:

    $ curl http://localhost:3007/rest/customers
    [
      {
        "id": 1,
        "data": "some mock data"
      },
      {
        "id": 2,
        "data": "some mock data"
      }
    ]

In order to learn more about creating and configuring services,
read the [documentation](documentation.html) pages.

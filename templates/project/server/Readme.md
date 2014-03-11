# Introduction

This is a simple web server which is generated to help the mocking and testing of the
Restful services declared in the `services` directory.

It is built on top of Express.js which runs on Node.js.

You can modify and extend this code as you like to fit your needs.
The `api.js` contains the implementation functions of the REST API calls which are referred from the `service.yml` descriptor files.


# Prerequisites

In order to run the server, you need to have the Node.js installed on your machine.
The required node modules come with the server code, under the `node_modules`
folder. If there is any of the modules might missing, you can install it with the
following command:

    npm install

This will download and install all the required modules defined in the `packages.json` file.


# Start the server

To start the server, execute the following command in the `server` folder:

    node app.js

When the server starts, you should see something like this:

    $ node app.js 
    Express server listening on port {{port}} in development mode


# Server configuration

The `config.yml` file contains the configuration parameters for the server.

## Further readings

To learn more about the server and its configuration, visit the [homepage](http://tombenke.github.io/rest-tool/) of the project, or directly the [server documentation](http://tombenke.github.io/rest-tool/docs/server.html) pages.

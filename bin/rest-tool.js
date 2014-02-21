#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * RestApi command-line utility
 */
(function() {
    var verbose = false;
    var fs = require('fs');
    var jsyaml = require('js-yaml');
    var should = require('should');
    var program = require('commander');
    var thisPackage = require(__dirname + '/../package.json');
    program._name = thisPackage.name;

    /**
     * Read the config file
     * @param  {string} fileName The name of the config file
     * @return {Object}          The configuration object
     */
    var readConfig = function( fileName ) {
        if (verbose) console.log('Read configuration from ' + fileName);
        var pathSep = require('path').sep;
        var inFileName = process.cwd() + pathSep + fileName;
        var config = require( inFileName );
        // TODO: validate config
        return config;
    };

    // Setup the project generator command
    program
        .version(thisPackage.version)
        .command('create <project-name>')
        .description('Create a new REST API project')
        .option("-v, --verbose", "Verbose mode", Boolean, false)
        .action(function(projectName, options) {
                verbose = options.verbose;
                require('../prjgen.js').create({
                        projectName: projectName,
                        port: "3007",
                        urlPrefix: "/rest",
                        username: "username",
                        password: "password",
                        servicesRoot: "services",
                        author: "TBD.",
                        licence: "TBD."
                    }, verbose);
                });

    // Setup the document generator command
    program
        .command('docs')
        .description('Documentation management')
        .option("-u, --update", "Generate the HTML format documentation")
        .option("-c, --config <configFileName>", "The name of the configuration file (default: config.yml)", String, 'config.yml')
        .option("-v, --verbose", "Verbose mode", Boolean, false)
        .action(function(options) {
                verbose = options.verbose;
                if( options.update ) {
                    require('../docgen.js').update(readConfig(options.config), verbose);
                }
            });

    // Setup the feature generator command
    program
        .command('add')
        .description('Add new service to the project')
        .option("-t, --type [type]", "Defines the type (OPERATION|COLLECTION|RESOURCE) of the service (default: RESOURCE)", String, "OPERATION")
        .option("-p, --path <path>", "The path of the service description relative to project-root/service/", String)
        .option("-u, --urlPattern <urlPattern>", "The unique URL pattern of the service", String)
        .option("-n, --name <name>", "The name of the operation/collection/resource", String)
        .option("-c, --config [configFileName]", "The name of the configuration file (default: config.yml)", String, 'config.yml')
        .option("-v, --verbose", "Verbose mode", Boolean, false)
        .action(function(options) {
                verbose = options.verbose;
                if( options.type && options.path && options.urlPattern ) {
                    try {
                        ['OPERATION', 'COLLECTION', 'RESOURCE'].should.containEql(options.type);
                        require('../serviceGen.js').add({
                            type: options.type,
                            path: options.path,
                            name: options.name,
                            urlPattern: options.urlPattern
                        }, readConfig(options.config), verbose);
                    } catch (error) {
                        console.log('ERROR: ', error.message);
                    }
                } else {
                    console.log('ERROR: missing arguments' );
                }
            });

    // Setup the test generator command
    program
        .command('test')
        .description('Test cases management')
        .option("-u, --update", "Update the test cases or create them, if they are missing")
        .option("-o, --overwrite", "Overwrite the existing files")
        .option("-c, --config <configFileName>", "The name of the configuration file (default: config.yml)", String, 'config.yml')
        .option("-v, --verbose", "Verbose mode", Boolean, false)
        .action(function(options) {
                verbose = options.verbose;
                if( options.update ) {
                    require('../testgen.js').update(readConfig(options.config), options.overwrite || false, verbose);
                }
            });

    // Setup the feature generator command
    // program
    //     .command('upgrade')
    //     .description('Upgrade the project to the latest version of rest-tool version')
    //     .option("-v, --verbose", "Verbose mode", Boolean, false)
    //     .action(function(options) {
    //             verbose = options.verbose;
    //             console.log('Not implemented yet');
    //         });

    program.parse(process.argv);
})();
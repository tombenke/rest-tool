#!/usr/bin/env node
'use strict';

/**
 * RestApi command-line utility
 */
(function() {
    var verbose = false;
    var fs = require('fs');
    var jsyaml = require( 'js-yaml' );
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

    program.parse(process.argv);
})();
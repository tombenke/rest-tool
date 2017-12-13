#!/usr/bin/env node

/*jshint node: true */
'use strict';

var yargs = require('yargs');

var parse = function parse(defaults) {
    var processArgv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.argv;


    var defaultAuthor = 'anonymous';
    var defaultProjectName = 'noname';
    var defaultApiVersion = '1.0.0';

    var results = {};

    yargs(processArgv.slice(2)).command('create', 'create a new project', function (yargs) {
        return yargs.option('projectName', {
            alias: 'n',
            desc: "The name of the REST API project",
            type: 'string'
        }).option('author', {
            alias: 'a',
            desc: "The username of the author",
            type: 'string',
            default: defaultAuthor
        }).option('apiVersion', {
            alias: 'v',
            desc: "The version the REST API project",
            type: 'string',
            default: defaultApiVersion
        }).demandOption(['projectName']);
    }, function (argv) {
        results = {
            command: {
                name: 'create',
                args: {
                    projectName: argv.projectName,
                    apiVersion: argv.apiVersion,
                    author: argv.author
                }
            },
            cliConfig: {}
        };
    }).command('docs', 'Documentation generator', function (yargs) {
        return yargs.option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        }).option("docsTemplates", {
            alias: "t",
            desc: "The path to the directory which holds the document templates",
            type: 'string',
            default: defaults.docsTemplates
        }).option("docsTargetDir", {
            alias: "d",
            desc: "The path to the directory which holds the generated result documents",
            type: 'string',
            default: defaults.docsTargetDir
        }).option("sourceDir", {
            alias: "s",
            desc: "The path to the project folder",
            type: 'string',
            default: defaults.sourceDir
        }).option("endpoints", {
            alias: "e",
            desc: "The relative path to the endpoint descriptors",
            type: 'string',
            default: defaults.endpoints
        }).option("projectName", {
            alias: "n",
            desc: "The name of the REST API project",
            type: 'string',
            default: defaults.projectName || defaultProjectName
        }).option("apiVersion", {
            alias: "v",
            desc: "The version the REST API project",
            type: 'string',
            default: defaults.apiVersion || defaultApiVersion
        }).demandOption([]);
    }, function (argv) {
        results = {
            command: {
                name: 'docs',
                args: {}
            },
            cliConfig: {
                configFileName: argv.config,
                sourceDir: argv.sourceDir,
                endpoints: argv.endpoints,
                projectName: argv.projectName,
                docsTargetDir: argv.docsTargetDir,
                apiVersion: argv.apiVersion
            }
        };
    }).command('add', 'Add new service to the project', function (yargs) {
        return yargs.option("type", {
            alias: "t",
            desc: "Defines the type (OPERATION|COLLECTION|RESOURCE) of the service",
            default: "OPERATION"
        }).option("path", {
            alias: "p",
            desc: "The path of the service description relative to project-root/service/"
        }).option("uriTemplate", {
            alias: "u",
            desc: "The unique URL pattern of the service"
        }).option("name", {
            alias: "n",
            desc: "The name of the operation/collection/resource"
        }).option("desc", {
            alias: "d",
            desc: "The description of the service"
        }).option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        }).option("sourceDir", {
            alias: "s",
            desc: "The path to the project folder",
            type: 'string',
            default: defaults.sourceDir
        }).option("endpoints", {
            alias: "e",
            desc: "The relative path to the endpoint descriptors",
            type: 'string',
            default: defaults.endpoints
        }).demandOption(['path', 'uriTemplate', 'name', 'desc']);
    }, function (argv) {
        results = {
            command: {
                name: 'add',
                args: {
                    type: argv.type,
                    path: argv.path,
                    uriTemplate: argv.uriTemplate,
                    name: argv.name,
                    desc: argv.desc
                }
            },
            cliConfig: {
                configFileName: argv.config,
                sourceDir: argv.sourceDir,
                endpoints: argv.endpoints
            }
        };
    }).command('add-bulk', 'Add new services to the project in bulk mode', function (yargs) {
        return yargs.option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        }).option("services", {
            alias: "b",
            desc: "The filename of which contains the list of services to create",
            type: 'string',
            default: 'bulk.json'
        }).option("sourceDir", {
            alias: "s",
            desc: "The path to the project folder",
            type: 'string',
            default: defaults.sourceDir
        }).option("endpoints", {
            alias: "e",
            desc: "The relative path to the endpoint descriptors",
            type: 'string',
            default: defaults.endpoints
        }).demandOption(['services']);
    }, function (argv) {
        results = {
            command: {
                name: 'addBulk',
                args: {
                    services: argv.services
                }
            },
            cliConfig: {
                configFileName: argv.config,
                sourceDir: argv.sourceDir,
                endpoints: argv.endpoints
            }
        };
    }).command('test', 'Test generator', function (yargs) {
        return yargs.option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        }).option("testsTemplates", {
            alias: "t",
            desc: "The path to the directory which holds the tests templates",
            type: 'string',
            default: defaults.testTemplates
        }).option("testsTargetDir", {
            alias: "d",
            desc: "The path to the directory which holds the generated result test scripts",
            type: 'string',
            default: defaults.testsTargetDir
        }).option("sourceDir", {
            alias: "s",
            desc: "The path to the project folder",
            type: 'string',
            default: defaults.sourceDir
        }).option("endpoints", {
            alias: "e",
            desc: "The relative path to the endpoint descriptors",
            type: 'string',
            default: defaults.endpoints
        }).demandOption([]);
    }, function (argv) {
        results = {
            command: {
                name: 'test',
                args: {}
            },
            cliConfig: {
                configFileName: argv.config,
                sourceDir: argv.sourceDir,
                endpoints: argv.endpoints,
                testsTargetDir: argv.testsTargetDir,
                testTemplates: argv.testsTemplates
            }
        };
    }).demandCommand(1, "Must use a command!").showHelpOnFail(false, 'Specify --help for available options').help().parse();

    return results;
};

module.exports = {
    parse: parse
};
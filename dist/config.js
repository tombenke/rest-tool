'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The default configuration:
 *
 *  {
 *      app: {
 *          name: {String},             // The name of the generator tool
 *          version: {String}           // The version of the generator tool
 *      },
 *      configFileName: {String},       // The name of the config file '.rest-tool.yml',
 *      logLevel: {String},             // The log level: (info | warn | error | debug)
 *      endpoints: {String},            // The relative path to the endpoint descriptor folders
 *      sourceDir: {String},            // Absolute path to the API project directory
 *
 *      projectTemplates: {String},     // Path to the folder of project templates
 *
 *      docsTemplates: {String},        // Path to the folder of documentation templates
 *
 *      serverTemplates: {String},      // Path to the folder of server templates
 *
 *      servicesTemplates: {String},    // Path to the folder of services templates
 *      testTemplates: {String},        // Path to the folder of test templates
 *      docsTargetDir: {String},        // Absolute path to the target documentation directory
 *
 *      TODO: to clarify:
 *      projectName: {String},          // The name of the API project
 *      apiVersion: {String},           // The version of the API project
 *      author: {String},               // The username of the author
 *      servicesRoot: {String}          // 'services'
 */
module.exports = {
    app: {
        name: _package2.default.name,
        version: _package2.default.version
    },
    configFileName: 'config.yml',
    logLevel: 'info',
    sourceDir: _path2.default.resolve('./'),
    endpoints: 'services',

    projectTemplates: _path2.default.resolve(__dirname, '../templates/project'),
    servicesTemplates: _path2.default.resolve(__dirname, '../templates/services'),
    docsTemplates: _path2.default.resolve(__dirname, '../templates/docs'),
    testTemplates: _path2.default.resolve(__dirname, '../templates/test'),
    serverTemplates: _path2.default.resolve(__dirname, '../templates/server'),

    docsTargetDir: _path2.default.resolve('docs'),
    testsTargetDir: _path2.default.resolve('tests')

    // Use values from environment variables if there is any needed
    // for example:
    // logLevel: process.env.REST_TOOL_LOG_LEVEL || defaults.logLevel
    // ...
};
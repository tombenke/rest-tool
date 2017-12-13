import path from 'path'
import thisPackage from '../package.json'
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
        name: thisPackage.name,
        version: thisPackage.version
    },
    configFileName: 'config.yml',
    logLevel: 'info',
    sourceDir: path.resolve('./'),
    endpoints: 'services',

    projectTemplates: path.resolve(__dirname, '../templates/project'),
    servicesTemplates: path.resolve(__dirname, '../templates/services'),
    docsTemplates: path.resolve(__dirname, '../templates/docs'),
    testTemplates: path.resolve(__dirname, '../templates/test'),
    serverTemplates: path.resolve(__dirname, '../templates/server'),
    
    docsTargetDir: path.resolve('docs'),
    testsTargetDir: path.resolve('tests')

    // Use values from environment variables if there is any needed
    // for example:
    // logLevel: process.env.REST_TOOL_LOG_LEVEL || defaults.logLevel
    // ...
}

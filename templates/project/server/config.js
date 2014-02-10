/* 
 * Reads the config parameters of the application from the config.yml file.
 */

// Load the YAML parser module
require( 'js-yaml' );

// Load the should module for validation
var should = require( 'should' );

var configFile = {};
var parameters = {};

/** Parse the config file and returns with the default config parameters */
var loadConfiguration = function( configFileName ) {
    // Load the YAML format config file
    configFile = require( configFileName );

    configFile.should.be.an.Object;
    configFile.should.have.property( 'useEnvironment' );
    configFile.should.have.property( 'environments' );
    configFile.environments.should.be.an.Object;
    configFile.environments.should.have.property( 'default' );
    // configFile.environments[ 'default' ].useEnvironment = configFile.useEnvironment || "default";

    setEnvironment( configFile.useEnvironment )
    return parameters;
}

var setEnvironment = function ( environment ) {

    if( environment != null &&
        configFile.environments[ environment ].should.be.an.Object ) {
        // Process default values combined with
        // the parameters of the selected environment

        parameters = configFile.environments[ 'default' ];
        parameters.environment = environment;

        Object.getOwnPropertyNames( configFile.environments[environment] ).forEach( function( key ) {
            parameters[ key ] = configFile.environments[environment][ key ];
        });
    } else {
        console.log('ERROR: Wrong environment "' + environment + '"');
    }
    return parameters;
}

// Set the config parameters to the default environment
var parameters = loadConfiguration(__dirname + '/config.yml');

exports.setEnvironment = setEnvironment;
exports.parameters = parameters;

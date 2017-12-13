"use strict";

/**
 * Load and merge the configuration parameters of the application
 * with external config file and CLI parameters.
 *
 * @arg {String} configFile - The path to the config file to load if exists
 * @arg {Object} cliOptions - The config parameters given by the CLI
 *
 * @return {Object} - The result configuration object:

 */
var load = function load(configFile) {
  return _.merge(config, defaults, defaultConfigFileOptions, environment, loadJsonFileSync(configFile, false), cliOptions);
};

/**
 * Load default config file if it exists
 *
 * @return {Object} - The loaded configuration.
 * If the config does not exist, then returns with an empty object: `{}`.
 *
 * @function
 */
var defaultConfigFileOptions = loadJsonFileSync(defaults.configFileName, false);

// Sets the initial configuration parameters using: built-in defaults, default config file and environment
_.merge(config, defaults, defaultConfigFileOptions(), environment);

module.exports = config;
'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var execNotDefined = function execNotDefined(context, commandArgs) {
    return console.log('executive is not defined');
};

var makeConfig = function makeConfig(defaults, cliConfig) {
    var configFile = _lodash2.default.merge({}, defaults.configFileName ? (0, _datafile.loadJsonFileSync)(defaults.configFileName, false) : {}, cliConfig.configFileName ? (0, _datafile.loadJsonFileSync)(cliConfig.configFileName, false) : {});
    var config = _lodash2.default.merge({}, defaults, configFile, cliConfig);
    return config;
};

module.exports = function (defaults, cli, exec) {
    var startup = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var shutdown = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    var _cli$parse = cli.parse(defaults),
        cliConfig = _cli$parse.cliConfig,
        command = _cli$parse.command;

    var container = {
        config: makeConfig(defaults, cliConfig),
        logger: console
    };

    return {
        start: function start() {
            console.log('app is starting...', container, command.args);
            //TODO: startup
            var executive = exec[command.name] || execNotDefined;
            executive(container, command);
        },
        stop: function stop() {
            // TODO: shutdown
            console.log('app is stopping...');
        }
    };
};
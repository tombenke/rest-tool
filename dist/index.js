#!/usr/bin/env node

/*jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

var _commands = require('./commands/');

var _commands2 = _interopRequireDefault(_commands);

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dumpCtx = function dumpCtx(ctx, next) {
    console.log('dumpCtx:', ctx);
    next(null, ctx);
};

var start = exports.start = function start() {
    var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    // Use CLI to gain additional parameters, and command to execute
    var _cli$parse = _cli2.default.parse(_config2.default, argv),
        cliConfig = _cli$parse.cliConfig,
        command = _cli$parse.command;

    console.log(cliConfig, command);
    // Create the final configuration parameter set
    var config = _npac2.default.makeConfig(_config2.default, cliConfig, 'configFileName');
    console.log(config);

    // Define the adapters and executives to add to the container
    var adapters = [dumpCtx, _npac2.default.mergeConfig(config), dumpCtx, _commands2.default, dumpCtx];

    // Define the jobs to execute: hand over the command got by the CLI.
    var jobs = [_npac2.default.makeCallSync(command)];

    //Start the container
    console.log(adapters, jobs);
    _npac2.default.start(adapters, jobs, cb);
};
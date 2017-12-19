#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

var _commands = require('./commands/');

var _commands2 = _interopRequireDefault(_commands);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _cli$parse = _cli2.default.parse(),
    cliConfig = _cli$parse.cliConfig,
    command = _cli$parse.command;

var config = _index2.default.makeConfig(_config2.default, cliConfig, 'configFileName');
var adapters = [_index2.default.mergeConfig(config), _commands2.default];
var jobs = [_index2.default.makeCallSync(command)];
_index2.default.start(adapters, jobs);

//import npac from './npac'

//const app = npac(defaults, cli, commands)
//app.start()
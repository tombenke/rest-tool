#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

var _commands = require('./commands/');

var _commands2 = _interopRequireDefault(_commands);

var _rome = require('./rome');

var _rome2 = _interopRequireDefault(_rome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _rome2.default)(_config2.default, _cli2.default, _commands2.default);
app.start();
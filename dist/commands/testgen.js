#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dgen = require('dgen');

var _dgen2 = _interopRequireDefault(_dgen);

var _restToolCommon = require('rest-tool-common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Update test cases or create them, if they are missing
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @return {bool} - `true` if succesfully executed, `false` otherwise
 *
 * @function
 */
exports.update = function (container, args) {
    var context = container.config;
    container.logger.info('Update test cases or create them, if they are missing.');

    _restToolCommon.services.load(context.sourceDir, context.endpoints);
    container.logger.debug(_restToolCommon.services.getServices());

    var allTestCases = _restToolCommon.services.getAllTestCases();
    container.logger.debug('All TestCases: ', allTestCases);

    _dgen2.default.createDirectoryTree(context.testsTargetDir, [], false);
    _lodash2.default.map(allTestCases, function (item) {
        _dgen2.default.processTemplate(_lodash2.default.merge({}, context, item.testCase), {
            sourceBaseDir: context.testTemplates,
            targetBaseDir: context.testsTargetDir,
            template: item.testCase.template,
            target: item.testCase.name + '.js'
        });
    });
};
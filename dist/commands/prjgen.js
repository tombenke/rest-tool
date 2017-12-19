#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dgen = require('dgen');

var _dgen2 = _interopRequireDefault(_dgen);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initProjectFolder = function initProjectFolder(context, projectBaseDir) {
    return _dgen2.default.createDirectoryTree(projectBaseDir, ["services", "services/monitoring", "services/monitoring/isAlive"], false);
};

var copyProjectFiles = function copyProjectFiles(context, projectBaseDir) {
    return _lodash2.default.map([""], function (dirName) {
        return _dgen2.default.copyDir({
            sourceBaseDir: context.projectTemplates,
            targetBaseDir: projectBaseDir,
            dirName: dirName,
            forceDelete: true,
            excludeHiddenUnix: true,
            preserveFiles: false,
            inflateSymlinks: true
        });
    });
};

var processProjectTemplates = function processProjectTemplates(context, projectBaseDir) {
    return _lodash2.default.map(["README.md", "package.json", "services/monitoring/isAlive/service.yml"], function (template) {
        return _dgen2.default.processTemplate(context, {
            sourceBaseDir: context.projectTemplates,
            targetBaseDir: projectBaseDir,
            template: template
        });
    });
};

/**
 * Create a new REST API project
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.create = function (container, args) {
    var context = _lodash2.default.merge({}, container.config, args);
    var projectBaseDir = _path2.default.resolve(context.sourceDir, context.projectName);
    console.log('Generate the "' + context.projectName + '" REST-API project into "' + projectBaseDir + '"');
    initProjectFolder(context, projectBaseDir);
    copyProjectFiles(context, projectBaseDir);
    processProjectTemplates(context, projectBaseDir);
};
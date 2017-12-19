#!/usr/bin/env node

/*jslint node: true */
'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dgen = require('dgen');

var _dgen2 = _interopRequireDefault(_dgen);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _restToolCommon = require('rest-tool-common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTargetDirectories = function createTargetDirectories(context) {
    return _dgen2.default.createDirectoryTree(context.docsTargetDir, ["/images", "/js", "/sass", "/stylesheets", "services"], true);
};

/**
 * Copy files needed by the documentation
 */
var copyDocDependencies = function copyDocDependencies(context) {
    return _lodash2.default.map(["images", "js", "sass", "stylesheets"], function (dirName) {
        _dgen2.default.copyDir({
            sourceBaseDir: context.docsTemplates,
            targetBaseDir: context.docsTargetDir,
            dirName: dirName,
            forceDelete: true,
            excludeHiddenUnix: true,
            preserveFiles: false,
            inflateSymlinks: true
        });
    });
};

/**
 * Copy the whole services tree (temporary solution)
 */
var copyEndpoints = function copyEndpoints(context) {
    return _dgen2.default.copyDir({
        sourceBaseDir: context.sourceDir,
        targetBaseDir: context.docsTargetDir,
        dirName: context.endpoints,
        forceDelete: true,
        excludeHiddenUnix: true,
        preserveFiles: false,
        inflateSymlinks: true
    });
};

var copyOtherFiles = function copyOtherFiles(context) {
    return _lodash2.default.map(["README.md"], function (fileName) {
        _dgen2.default.copyFile(fileName, context.docsTemplates, context.docsTargetDir);
    });
};

var initDocsFolder = function initDocsFolder(context) {
    if (createTargetDirectories(context)) {
        copyDocDependencies(context);
        copyEndpoints(context);
        copyOtherFiles(context);
    }
    return true;
};

var generateDocFileName = function generateDocFileName(serviceDesc) {
    return serviceDesc.contentPath + '/service.html';
};

// Generate the main index page of the API documentation
var generateDocIndex = function generateDocIndex(context) {
    console.log('Generate document index');
    _dgen2.default.processTemplate(context, {
        sourceBaseDir: context.docsTemplates,
        targetBaseDir: context.docsTargetDir,
        template: 'index.html'
    });
};

/**
 * Generate the HTML page for one service endpoint descriptor
 *
 * @arg {Object} serviceDesc - The service descriptor object
 * @arg {Object} context - Configuration parameters. See `config.load()`
  *
 * @function
 */
var generateServiceDoc = function generateServiceDoc(serviceDesc, context) {

    var relPath = "";
    for (var l = 0; l < serviceDesc.contentPath.split('/').length; l++) {
        relPath = relPath + ".." + _path2.default.sep;
    }

    console.log('Generate service doc: ' + serviceDesc.contentPath, serviceDesc.name);
    // console.log('context: ', context)

    var doc = _lodash2.default.merge({ relPath: relPath }, context, _dgen2.default.convertMarkdown(serviceDesc, ['description', 'summary', 'details']));
    //console.log(JSON.stringify(doc, null, '  '))

    _dgen2.default.processTemplate(doc, {
        sourceBaseDir: context.docsTemplates,
        targetBaseDir: context.docsTargetDir,
        template: 'restapi.html',
        target: generateDocFileName(serviceDesc)
    });
};

/**
 * Generate the HTML format documentation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.update = function (container, args) {
    var context = container.config;
    container.logger.info('Generate the HTML format documentation');
    initDocsFolder(context);

    // Load service descriptors
    _restToolCommon.services.load(context.sourceDir, context.endpoints);

    // Prepare the list of all services for generation of documents
    var allServices = _restToolCommon.services.getServices();

    context.serviceDocNames = _lodash2.default.map(allServices, function (serviceDesc) {
        return {
            name: serviceDesc.name,
            docFileName: generateDocFileName(serviceDesc)
        };
    });

    // Set the time of generation
    context.lastUpdate = new Date();

    // Generate the documents for each service
    _lodash2.default.map(allServices, function (serviceDesc) {
        generateServiceDoc(serviceDesc, context);
    });

    // Generate the index.html
    generateDocIndex(context);
};
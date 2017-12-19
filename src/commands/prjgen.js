#!/usr/bin/env node
/*jshint node: true */
'use strict';

import _ from 'lodash'
import generator from 'dgen'
import path from 'path'

const initProjectFolder = (context, projectBaseDir) => generator.createDirectoryTree(
    projectBaseDir, ["services", "services/monitoring", "services/monitoring/isAlive"], false)

const copyProjectFiles = (context, projectBaseDir) => _.map([
        ""
    ], dirName => generator.copyDir({
        sourceBaseDir: context.projectTemplates,
        targetBaseDir: projectBaseDir,
        dirName: dirName,
        forceDelete: true,
        excludeHiddenUnix: true,
        preserveFiles: false,
        inflateSymlinks: true
    }))

const processProjectTemplates = (context, projectBaseDir) => _.map([
    "README.md",
    "package.json",
    "services/monitoring/isAlive/service.yml"], template =>
    generator.processTemplate(context, {
        sourceBaseDir: context.projectTemplates,
        targetBaseDir: projectBaseDir,
        template: template
    }))

/**
 * Create a new REST API project
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.create = (container, args) => {
    const context = _.merge({}, container.config, args)
    const projectBaseDir = path.resolve(context.sourceDir, context.projectName)
    console.log(`Generate the "${context.projectName}" REST-API project into "${projectBaseDir}"`)
    initProjectFolder(context, projectBaseDir)
    copyProjectFiles(context, projectBaseDir)
    processProjectTemplates(context, projectBaseDir)
}

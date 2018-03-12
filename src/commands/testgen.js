#!/usr/bin/env node
/*jshint node: true */
'use strict';

import _ from 'lodash'
import generator from 'dgen'
import { services } from 'rest-tool-common'

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
exports.update = (container, args) => {
    const context = container.config
    container.logger.info('Update test cases or create them, if they are missing.')

    services.load(context.sourceDir, context.endpoints)
    container.logger.debug(services.getServices())

    const allTestCases = services.getAllTestCases()
    container.logger.debug('All TestCases: ', allTestCases)

    generator.createDirectoryTree(context.testsTargetDir, [], false)
    _.map(allTestCases, function (item) {
        generator.processTemplate(_.merge({}, context, item.testCase), {
            sourceBaseDir: context.testTemplates,
            targetBaseDir: context.testsTargetDir,
            template: item.testCase.template,
            target: item.testCase.name + '.js'
        })
    })
}

#!/usr/bin/env node
/*jshint node: true */
'use strict';

import _ from 'lodash'
import path from 'path'
import generator from 'dgen'
import { loadJsonFileSync } from 'datafile'

const serviceTemplates = {
    'OPERATION': [
        "service.yml",
        "postOperation-requestBody.json",
        "postOperation-responseBody.json"
    ],
    'COLLECTION': [
        "service.yml",
        "getCollection-responseBody.json",
        "postCollection-requestBody.json",
        "postCollection-responseBody.json"
    ],
    'RESOURCE': [
        "service.yml",
        "getResource-responseBody.json",
        "putResource-requestBody.json",
        "putResource-responseBody.json",
        "deleteResource-responseBody.json"
    ]
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const extendConfig = (serviceConfig) => {
    const cName = capitalizeFirstLetter(serviceConfig.name)
    serviceConfig.cName = cName

    return serviceConfig
}

/**
 * Make a path string surely relative
 *
 * @arg {String} path - A string that represents an absolute or relative path
 *
 * @return {String} - The relative path
 *
 * @function
 */
const makeRelPath = path => path[0] === '/' ? path.substr(1, path.length) : path

/**
 * Add a new service descriptor to the project
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.add = (container, args) => {
    const context = container.config
    const serviceConfig = args
    if(serviceConfig.type && serviceConfig.path && serviceConfig.uriTemplate) {
        if (_.includes(['OPERATION', 'COLLECTION', 'RESOURCE'], serviceConfig.type)) {
            const servicePath = path.resolve(context.sourceDir, context.endpoints, makeRelPath(serviceConfig.path))
            container.logger.info(`Create the "${servicePath}" ${serviceConfig.type}-type service with the following URL: ${serviceConfig.uriTemplate}`)

            if (generator.createDirectoryTree(servicePath, [], false)) {
                container.logger.info(`${servicePath} directory created`)
                const templates = serviceTemplates[serviceConfig.type] || []
                _.map(templates, template => {
                    generator.processTemplate(extendConfig(serviceConfig), {
                        sourceBaseDir: path.resolve(context.servicesTemplates, serviceConfig.type),
                        targetBaseDir: servicePath,
                        template: template
                    })
                })
            } else {
                container.logger.info(`ERROR: Could not create directory: ${servicePath}`)
            }
        } else {
            container.logger.info(`ERROR: Wrong type parameter: ${serviceConfig.type}`)
        }
    } else {
        container.logger.info('ERROR: Missing or wrong parameter(s)')
    }
}

/**
 * Add one or more new service descriptors to the project in bulk mode
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
exports.addBulk = (container, args) => {
    const context = container.config
    if(args.services) {
        const bulkServicesPath = path.resolve(args.services)
        const bulkServices = loadJsonFileSync(bulkServicesPath)
        container.logger.info(`Add new services to the project in bulk mode from "${bulkServicesPath}"`)

        _.map(bulkServices, service => exports.add(container, service))
    } else {
        container.logger.info('ERROR: missing arguments: services' )
    }
}

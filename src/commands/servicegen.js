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
 * @arg {Object} command - Command descriptor object. Describe the name of the command to execute, as well as its arguments.
 *
 * @function
 */
exports.add = (container, command) => {
    const context = container.config
    const serviceConfig = command.args
    if(serviceConfig.type && serviceConfig.path && serviceConfig.uriTemplate) {
        if (_.includes(['OPERATION', 'COLLECTION', 'RESOURCE'], serviceConfig.type)) {
            const servicePath = path.resolve(context.sourceDir, context.endpoints, makeRelPath(serviceConfig.path))
            console.log('Create the "%s" %s-type service with the following URL: %s', servicePath, serviceConfig.type, serviceConfig.uriTemplate)

            if (generator.createDirectoryTree(servicePath, [], false)) {
                console.log('%s directory created', servicePath)
                const templates = serviceTemplates[serviceConfig.type] || []
                _.map(templates, template => {
                    generator.processTemplate(extendConfig(serviceConfig), {
                        sourceBaseDir: path.resolve(context.servicesTemplates, serviceConfig.type),
                        targetBaseDir: servicePath,
                        template: template
                    })
                })
            } else {
                console.log(`ERROR: Could not create directory: ${servicePath}`)
            }
        } else {
            console.log(`ERROR: Wrong type parameter: ${serviceConfig.type}`)
        }
    } else {
        console.log('ERROR: Missing or wrong parameter(s)')
    }
}

/**
 * Add one or more new service descriptors to the project in bulk mode
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} command - Command descriptor object. Describe the name of the command to execute, as well as its arguments.
 *
 * @function
 */
exports.addBulk = (container, command) => {
    const context = container.config
    if(command.args.services) {
        const bulkServicesPath = path.resolve(command.args.services)
        const bulkServices = loadJsonFileSync(bulkServicesPath)
        console.log(`Add new services to the project in bulk mode from "${bulkServicesPath}"`)

        _.map(bulkServices, service => exports.add(container, { name: 'add', args: service }))
    } else {
        console.log('ERROR: missing arguments: services' )
    }
}

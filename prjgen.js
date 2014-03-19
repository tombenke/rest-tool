#!/usr/bin/env node
/*jshint node: true */
'use strict';

var generator = require('rest-tool-common').generator,
    path = require('path');
var verbose = false;

/**
 * Create a new REST API project
 * @param  {String} projectName The name of the project
 * @return {bool}               `true` if succesfully executed, `false` otherwise
 */
exports.create = function (context, mode) {
    verbose = mode;

    if ( generator.createDirectoryTree(context.projectName, [
        "docs",
        "server",
        "services",
        "services/monitoring",
        "services/monitoring/isAlive",
        "templates",
        "templates/docs",
        "templates/docs/images",
        "templates/docs/js",
        "templates/docs/sass",
        "templates/docs/stylesheets",
        "templates/server",
        "templates/test",
        "test" ], false) ) {

        [
            "docs",
            "templates/docs",
            "templates/server",
            "templates/services",
            "templates/test"
        ].forEach(function(dirName) {
            generator.copyDir(context, {
                sourceBaseDir: path.resolve(__dirname, "templates/project"),
                targetBaseDir: context.projectName,
                dirName: dirName, // The directory to copy
                forceDelete: true, // Whether to overwrite existing directory or not
                excludeHiddenUnix: true, // Whether to copy hidden Unix files or not (preceding .)
                preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
                inflateSymlinks: true // Whether to follow symlinks or not when copying files
                // filter: regexp, // A filter to match files against; if matches, do nothing (exclude).
                // whitelist: bool, // if true every file or directory which doesn't match filter will be ignored
            });
        });

        [
            "README.md",
            "Makefile",
            "config.yml",
            "package.json",

            "services/monitoring/isAlive/service.yml",

            "server/Readme.md",
            "server/api.js",
            "server/server.js",
            "server/config.js",
            "server/config.yml",
            "server/monitoring.js",
            "server/package.json",

            "templates/test/testGetMethod.mustache",
            "templates/test/testPutMethod.mustache",
            "templates/test/testDelMethod.mustache",
            "templates/test/testPostMethod.mustache"
        ].forEach(function(template) {
            generator.processTemplate(context, {
                sourceBaseDir: path.resolve(__dirname, "templates/project"),
                targetBaseDir: context.projectName,
                template: template
            });
        });
    }
};

/**
 * Upgrade an existing REST API project
 * @return {bool}               `true` if succesfully executed, `false` otherwise
 */
exports.upgrade = function (context, mode) {
    verbose = mode;

    // 0. Make a backup from the files and folders that will be changed.
    if ( generator.createDirectoryTree('orig', [], false)) {
        // 0.1 Make backup of:
        //   - ./server/*
        //   - ./templates/*
        [
            "templates",
            "server"
        ].forEach(function(dirName) {
            generator.copyDir(context, {
                sourceBaseDir: path.resolve(),
                targetBaseDir: path.resolve('orig'),
                dirName: dirName, // The directory to copy
                forceDelete: true, // Whether to overwrite existing directory or not
                excludeHiddenUnix: true, // Whether to copy hidden Unix files or not (preceding .)
                preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
                inflateSymlinks: true // Whether to follow symlinks or not when copying files
                // filter: regexp, // A filter to match files against; if matches, do nothing (exclude).
                // whitelist: bool, // if true every file or directory which doesn't match filter will be ignored
            });
        });

        // 0.2 Make backup of:
        // ./README.md
        // ./Makefile
        // ./config.yml
        // ./package.json

        [
            "README.md",
            "Makefile",
            "config.yml",
            "package.json"
        ].forEach(function(fileName) {
            generator.copyFile(fileName, path.resolve(), path.resolve('orig'),{});
        });
    }

    [
        "docs",
        "templates/docs",
        "templates/server",
        // "templates/services",
        "templates/test"
    ].forEach(function(dirName) {
        generator.copyDir(context, {
            sourceBaseDir: path.resolve(__dirname, "templates/project"),
            targetBaseDir: path.resolve(),
            dirName: dirName, // The directory to copy
            forceDelete: true, // Whether to overwrite existing directory or not
            excludeHiddenUnix: true, // Whether to copy hidden Unix files or not (preceding .)
            preserveFiles: false, // If we're overwriting something and the file already exists, keep the existing
            inflateSymlinks: true // Whether to follow symlinks or not when copying files
            // filter: regexp, // A filter to match files against; if matches, do nothing (exclude).
            // whitelist: bool, // if true every file or directory which doesn't match filter will be ignored
        });
    });

    [
        // 1. Overwrite the following files:
        "README.md",
        "Makefile",
        "config.yml",
        "package.json",

        // "services/monitoring/isAlive/service.yml",

        // 2. Overwrite the `./templates/` folder with the new version.
        "templates/test/testGetMethod.mustache",
        "templates/test/testPutMethod.mustache",
        "templates/test/testDelMethod.mustache",
        "templates/test/testPostMethod.mustache",

        // 3. Overwrite the `./server/` folder with the new version.
        "server/Readme.md",
        "server/api.js",
        "server/server.js",
        "server/config.js",
        "server/config.yml",
        "server/monitoring.js",
        "server/package.json",

    ].forEach(function(template) {
        generator.processTemplate(context, {
            sourceBaseDir: path.resolve(__dirname, "templates/project"),
            targetBaseDir: path.resolve(),
            template: template
        });
    });
};
#!/usr/bin/env node
/*jshint node: true */
'use strict';

var mu = require('mu2'),
    fs = require('fs'),
    extend = require('rest-tool-common').extend;
var verbose = false;

/**
 * Update test cases or create them, if they are missing
 * @param  {bool} overwrite Overwrite the existing files if `true`
 * @param  {bool} verbose   Work in verbose mode if `true`
 * @return {bool}           `true` if succesfully executed, `false` otherwise
 */
exports.update = function ( config, overwrite, mode ) {
    verbose = mode;
    console.log('Update test cases or create them, if they are missing.');
    if( overwrite ) {
        console.log('Overwrite the existing files');
    } else {
        console.log('Existing files will not be overwritten');
    }
    var path = require('path'),
        pathSep = path.sep;

    var services = require('rest-tool-common').services;
    services.load(process.cwd());
    if (verbose) console.log(services.getServices());

    var allTestCases = services.getAllTestCases();
    if (verbose) console.log('All TestCases: ', allTestCases);

    allTestCases.forEach(function(item) {
        var testCase = item.testCase,
            templateFileName = path.join(process.cwd(), 'templates', 'test', testCase.template),
            fileName = path.join(process.cwd(), 'test', testCase.name + '.js'),
            buffer = '',
            view = {};
        if (verbose) console.log('templateFileName: ' + templateFileName);
        if (verbose) console.log('fileName: ' + fileName);

        extend(view, config, testCase);

        // verbose && console.log('template context:', view);
        mu.compileAndRender(templateFileName, view)
            .on('data', function(c) {
                buffer += c.toString();
            })
            .on('end', function() {
                fs.writeFile(fileName, buffer, function(err) {
                    if (err) throw err;
                });
            });
    });
};
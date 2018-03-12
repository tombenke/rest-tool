import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'
import { expect } from 'chai'
import * as _ from 'lodash'
import {
    loadJsonFileSync,
    mergeJsonFilesSync,
    listFilesSync,
    findFilesSync
} from 'datafile'
import defaults from '../config'
import { create } from './prjgen'
import { add, addBulk } from './servicegen'
import npac from 'npac'

describe('servicegen', () => {

    const testDirectory = path.resolve('./tmp')
    const testProjectName = 'testProject'
    const executives = { create: create, add: add, addBulk: addBulk }

    const createConfig = _.merge({}, defaults, { sourceDir: testDirectory })

    const createCommand = {
        name: 'create',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    }

    const addConfig = _.merge({}, defaults, { sourceDir: path.resolve(testDirectory, testProjectName) })

    const addCommand = {
        name: 'add',
        args: {
            type: 'OPERATION',
            path: 'newservice',
            uriTemplate: '/newservice',
            name: 'New Service',
            desc: 'Description of new service'
        }
    }

    const addCommandWrongType = {
        name: 'add',
        args: {
            type: 'WRONG_TYPE',
            path: 'newservice',
            uriTemplate: '/newservice',
            name: 'New Service',
            desc: 'Description of new service'
        }
    }

    const addCommandMissingArgs = {
        name: 'add',
        args: {}
    }

    const addBulkConfig = addConfig

    const addBulkCommand = {
        name: 'addBulk',
        args: { services: './src/commands/fixtures/bulkServices.yml' }
    }

    const destCleanup = function(cb) {
        const dest = testDirectory
        rimraf(dest, cb)
    }

    beforeEach(function(done) {
        destCleanup(function() {
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    afterEach(function(done) {
        destCleanup(done)
    })

    it('add - with defaults', (done) => {
        npac.runJobSync(createConfig, executives, createCommand, (err, res) => {
            npac.runJobSync(addConfig, executives, addCommand, (err, res) => {
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedAddResult = loadJsonFileSync('src/commands/fixtures/expectedAddResult.yml')
                expect(results).to.eql(expectedAddResult)
                done()
            })
        })
    })

    it('add - with absolute path', (done) => {
        const addCommandAbs = _.merge({}, addCommand, { args: { path: '/' + addCommand.args.path } })
        npac.runJobSync(createConfig, executives, createCommand, (err, res) => {
            npac.runJobSync(addConfig, executives, addCommandAbs, (err, res) => {
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedAddResult = loadJsonFileSync('src/commands/fixtures/expectedAddResult.yml')
                expect(results).to.eql(expectedAddResult)
                done()
            })
        })
    })

    it('add - with wrong type parameter', (done) => {
        npac.runJobSync(createConfig, executives, createCommand, (err, res) => {
            npac.runJobSync(addConfig, executives, addCommandWrongType, (err, res) => {
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedAddWrongResult = loadJsonFileSync('src/commands/fixtures/expectedAddWrongResult.yml')
                expect(results).to.eql(expectedAddWrongResult)
                done()
            })
        })
    })

    it('add - missing parameters', (done) => {
        npac.runJobSync(createConfig, executives, createCommand, (err, res) => {
            npac.runJobSync(addConfig, executives, addCommandMissingArgs, (err, res) => {
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedAddWrongResult = loadJsonFileSync('src/commands/fixtures/expectedAddWrongResult.yml')
                expect(results).to.eql(expectedAddWrongResult)
                done()
            })
        })
    })

    it('addBulk - with defaults', (done) => {
        npac.runJobSync(createConfig, executives, createCommand, (err, res) => {
            npac.runJobSync(addBulkConfig, executives, addBulkCommand, (err, res) => {
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedAddBulkResult = loadJsonFileSync('src/commands/fixtures/expectedAddBulkResult.yml')
                expect(results).to.eql(expectedAddBulkResult)
                done()
            })
        })
    })
})

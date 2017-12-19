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

describe('servicegen', () => {

    const testDirectory = path.resolve('./tmp')
    const testProjectName = 'testProject'

    const createContainer = {
        config: _.merge({}, defaults, { sourceDir: testDirectory })
    }
    const createCommand = {
        name: 'create',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    }

    const addContainer = {
        config: _.merge({}, defaults, { sourceDir: path.resolve(testDirectory, testProjectName) })
    }
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
        args: {
        }
    }

    const addBulkContainer = addContainer
    const addBulkCommand = { name: 'addBulk', args: { services: './src/commands/fixtures/bulkServices.yml' } }

    const destCleanup = function(cb) {
        const dest = testDirectory
        console.log('Remove: ', dest)
        rimraf(dest, cb)
    }

    beforeEach(function(done) {
        destCleanup(function() {
            console.log('Create: ', testDirectory)
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    afterEach(function(done) {
        destCleanup(done)
    })

    it('add - with defaults', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand.args)

        // rest-tool add --sourceDir ./tmp/testProject/ -p newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommand.args)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        const expectedAddResult = loadJsonFileSync('src/commands/fixtures/expectedAddResult.yml')
        expect(results).to.eql(expectedAddResult)
        done()
    })

    it('add - with absolute path', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand.args)

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommand.args)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        const expectedAddResult = loadJsonFileSync('src/commands/fixtures/expectedAddResult.yml')
        expect(results).to.eql(expectedAddResult)
        done()
    })

    it('add - with wrong type parameter', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand.args)

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommandWrongType.args)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        const expectedAddWrongResult = loadJsonFileSync('src/commands/fixtures/expectedAddWrongResult.yml')
        expect(results).to.eql(expectedAddWrongResult)
        done()
    })
    it('add - missing parameters', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand.args)

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommandMissingArgs.args)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        const expectedAddWrongResult = loadJsonFileSync('src/commands/fixtures/expectedAddWrongResult.yml')
        expect(results).to.eql(expectedAddWrongResult)
        done()
    })

    it('addBulk - with defaults', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand.args)

        // rest-tool add-bulk --sourceDir ./testProject/ -s ./src/commands/fixtures/bulkServices.yml
        addBulk(addBulkContainer, addBulkCommand.args)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        const expectedAddBulkResult = loadJsonFileSync('src/commands/fixtures/expectedAddBulkResult.yml')
        expect(results).to.eql(expectedAddBulkResult)
        done()
    })
})

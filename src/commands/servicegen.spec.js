import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'
import { expect } from 'chai'
import * as _ from 'lodash'
import {
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
    const addBulkCommand = { name: 'addBulk', args: { services: './src/fixtures/bulkServices.yml' } }

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
        create(createContainer, createCommand)

        // rest-tool add --sourceDir ./tmp/testProject/ -p newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommand)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        expect(results).to.eql([
            '/testProject/README.md',
            '/testProject/index.js',
            '/testProject/package.json',
            '/testProject/services/monitoring/isAlive/service.yml',
            '/testProject/services/newservice/postOperation-requestBody.json',
            '/testProject/services/newservice/postOperation-responseBody.json',
            '/testProject/services/newservice/service.yml'
        ])
        done()
    })

    it('add - with absolute path', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand)

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommand)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        expect(results).to.eql([
            '/testProject/README.md',
            '/testProject/index.js',
            '/testProject/package.json',
            '/testProject/services/monitoring/isAlive/service.yml',
            '/testProject/services/newservice/postOperation-requestBody.json',
            '/testProject/services/newservice/postOperation-responseBody.json',
            '/testProject/services/newservice/service.yml'
        ])
        done()
    })

    it('add - with wrong type parameter', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand)

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommandWrongType)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        expect(results).to.eql([
            '/testProject/README.md',
            '/testProject/index.js',
            '/testProject/package.json',
            '/testProject/services/monitoring/isAlive/service.yml'
        ])
        done()
    })
    it('add - missing parameters', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand)

        // rest-tool add --sourceDir ./tmp/testProject/ -p /newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommandMissingArgs)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        expect(results).to.eql([
            '/testProject/README.md',
            '/testProject/index.js',
            '/testProject/package.json',
            '/testProject/services/monitoring/isAlive/service.yml'
        ])
        done()
    })

    it('bulkAdd - with defaults', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand)

        // rest-tool add-bulk --sourceDir ./testProject/ -s ./src/fixtures/bulkServices.yml
        addBulk(addBulkContainer, addBulkCommand)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        expect(results).to.eql([
            '/testProject/README.md',
            '/testProject/index.js',
            '/testProject/package.json',
            '/testProject/services/monitoring/isAlive/service.yml',
            '/testProject/services/users/getCollection-responseBody.json',
            '/testProject/services/users/postCollection-requestBody.json',
            '/testProject/services/users/postCollection-responseBody.json',
            '/testProject/services/users/service.yml',
            '/testProject/services/users/user/deleteResource-responseBody.json',
            '/testProject/services/users/user/getResource-responseBody.json',
            '/testProject/services/users/user/putResource-requestBody.json',
            '/testProject/services/users/user/putResource-responseBody.json',
            '/testProject/services/users/user/service.yml'
        ])
        done()
    })
})

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
import { create, test } from './index'
import npac from 'npac'

describe('testgen', () => {

    const testDirectory = path.resolve('./tmp')
    const testProjectName = 'testProject'

    const createContainer = {
        config: _.merge({}, defaults, {
            logger: { level: 'debug' },
            sourceDir: testDirectory
        })
    }
    const createCommand = {
        name: 'create',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    }

    const testsContainer = {
        config: _.merge({}, defaults, {
            logger: { level: 'debug' },
            sourceDir: path.resolve(testDirectory, testProjectName),
            testsTargetDir: path.resolve(testDirectory, testProjectName, 'tests')
        })
    }
    const testsCommand = {
        name: 'test',
        args: {}
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

    it('tests - with defaults', (done) => {
        const config = createContainer.config
        const executives = { create: create, test: test }
        npac.runJobSync(config, executives, createCommand, (err, res) => {
            const results = findFilesSync(testDirectory, /.*/, true, true)
            const expectedCreateResult = loadJsonFileSync('src/commands/fixtures/expectedCreateResult.yml')
            expect(results).to.eql(expectedCreateResult)
            done()
            
        const config = testContainer.config
            npac.runJobSync(config, executives, testsCommand, (err, res) => {
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedTestsResult = loadJsonFileSync('src/commands/fixtures/expectedTestsResult.yml')
                expect(results).to.eql(expectedTestsResult)
                done()
            })
        })
    })
})

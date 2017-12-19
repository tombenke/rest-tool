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

describe('testgen', () => {

    const testDirectory = path.resolve('./tmp')
    const testProjectName = 'testProject'

    const createContainer = {
        config: _.merge({}, defaults, { sourceDir: testDirectory })
    }
    const createCommand = {
        name: 'create',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    }

    const testsContainer = {
        config: _.merge({}, defaults, {
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

    it('tests - with defaults', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand.args)

        // rest-tool docs --sourceDir ./tmp/testProject/
        test(testsContainer, testsCommand.args)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        console.log('results:', results)
        const expectedTestsResult = loadJsonFileSync('src/commands/fixtures/expectedTestsResult.yml')
        expect(results).to.eql(expectedTestsResult)
        done()
    })
})

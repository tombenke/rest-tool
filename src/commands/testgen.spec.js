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
        create(createContainer, createCommand)

        // rest-tool docs --sourceDir ./tmp/testProject/
        test(testsContainer, testsCommand)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        console.log('results:', results)
        expect(results).to.eql([
            '/testProject/README.md',
            '/testProject/index.js',
            '/testProject/package.json',
            '/testProject/services/monitoring/isAlive/service.yml',
            '/testProject/tests/Get Monitoring Is Alive.js'
        ])
        done()
    })
})

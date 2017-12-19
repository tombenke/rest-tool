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
import { create, docs } from './index'

describe('docgen', () => {

    const testDirectory = path.resolve('./tmp')
    const testProjectName = 'testProject'

    const createContainer = {
        config: _.merge({}, defaults, { sourceDir: testDirectory })
    }
    const createCommand = {
        name: 'create',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    }

    const docsContainer = {
        logger: console,
        config: _.merge({}, defaults, {
            sourceDir: path.resolve(testDirectory, testProjectName),
            docsTargetDir: path.resolve(testDirectory, testProjectName, 'docs')
        })
    }

    const docsCommand = {
        name: 'docs',
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

    it('docs - with defaults', (done) => {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        create(createContainer, createCommand.args)

        // rest-tool docs --sourceDir ./tmp/testProject/
        docs(docsContainer, docsCommand)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        const expectedDocsResult = loadJsonFileSync('src/commands/fixtures/expectedDocsResult.yml')
        expect(results).to.eql(expectedDocsResult)
        done()
    })
})

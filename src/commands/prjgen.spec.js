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
import npac from 'npac'

const testDirectory = path.resolve('./tmp')

const destCleanup = function(cb) {
    const dest = testDirectory
    rimraf(dest, cb)
}

describe('prjgen', () => {

    before(function(done) {
        destCleanup(function() {
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    after(function(done) {
        destCleanup(done)
    })

    it('create - with default config', (done) => {
        const config = _.merge({}, defaults, { sourceDir: testDirectory })
        const command = {
            name: 'create',
            args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
        }
        const executives = { create: create }

        npac.runJobSync(config, executives, command, (err, res) => {
            const results = findFilesSync(testDirectory, /.*/, true, true)
            const expectedCreateResult = loadJsonFileSync('src/commands/fixtures/expectedCreateResult.yml')
            expect(results).to.eql(expectedCreateResult)
            done()
        })
    })
})

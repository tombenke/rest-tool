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

const testDirectory = path.resolve('./tmp')

const destCleanup = function(cb) {
    const dest = testDirectory
    console.log('Remove: ', dest)
    rimraf(dest, cb)
}

describe('prjgen', () => {

    before(function(done) {
        destCleanup(function() {
            console.log('Create: ', testDirectory)
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    after(function(done) {
        destCleanup(done)
    })

    it('create - with default config', (done) => {
        const container = {
            config: _.merge({}, defaults, { sourceDir: testDirectory })
        }
        const command = {
            name: 'create',
            args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
        }
        create(container, command.args)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        const expectedCreateResult = loadJsonFileSync('src/commands/fixtures/expectedCreateResult.yml')
        expect(results).to.eql(expectedCreateResult)
        done()
    })
})

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
        create(container, command)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        expect(results).to.eql([
            '/testProject/README.md',
            '/testProject/index.js',
            '/testProject/package.json',
            '/testProject/services/monitoring/isAlive/service.yml' ])
        done()
    })
})

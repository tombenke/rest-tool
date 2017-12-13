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
        create(createContainer, createCommand)

        // rest-tool docs --sourceDir ./tmp/testProject/
        docs(docsContainer, docsCommand)
        const results = findFilesSync(testDirectory, /.*/, true, true)
        console.log('results:', results)
        expect(results).to.eql([
            '/testProject/README.md',
            '/testProject/docs/README.md',
            '/testProject/docs/images/collapse_arrow.gif',
            '/testProject/docs/images/expand_arrow.gif',
            '/testProject/docs/images/grid.png',
            '/testProject/docs/index.html',
            '/testProject/docs/js/jquery-1.11.0/jquery-1.11.0.js',
            '/testProject/docs/js/jquery-1.11.0/jquery-1.11.0.min.js',
            '/testProject/docs/js/jquery-1.11.0/jquery-1.11.0.min.map',
            '/testProject/docs/js/restapidoc.js',
            '/testProject/docs/sass/ie.scss',
            '/testProject/docs/sass/partials/_base.scss',
            '/testProject/docs/sass/print.scss',
            '/testProject/docs/sass/screen.scss',
            '/testProject/docs/services/monitoring/isAlive/service.html',
            '/testProject/docs/services/monitoring/isAlive/service.yml',
            '/testProject/docs/stylesheets/ie.css',
            '/testProject/docs/stylesheets/print.css',
            '/testProject/docs/stylesheets/screen.css',
            '/testProject/index.js',
            '/testProject/package.json',
            '/testProject/services/monitoring/isAlive/service.yml'
        ])
        done()
    })
})

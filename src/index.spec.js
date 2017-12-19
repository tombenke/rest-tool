import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'
import { expect } from 'chai'
import {
    loadJsonFileSync,
    findFilesSync
} from 'datafile'

import { start } from './index'

const testDirectory = path.resolve('./tmp')

const destCleanup = function(cb) {
    const dest = testDirectory
    console.log('Remove: ', dest)
    rimraf(dest, cb)
}

describe('app', () => {

    before(function(done) {
        destCleanup(function() {
            console.log('Create: ', testDirectory)
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    after(function(done) {
        destCleanup(done)
//        done()
    })

    const testProjectName = 'testProject'
    const processArgvToCreate = [
        'node', 'src/index.js',
        'create',
        '--sourceDir', testDirectory,
        '-n', testProjectName,
        '-v', 'v1.0.0',
        '-a', 'tombenke'
    ]

    const checkNewProject = () => {
        const results = findFilesSync(testDirectory, /.*/, true, true)
        const expectedCreateResult = loadJsonFileSync('src/commands/fixtures/expectedCreateResult.yml')
        expect(results).to.eql(expectedCreateResult)
    }
/*
    it('#start - with no arguments', (done) => {

        const processArgvEmpty = [
            'node', 'src/index.js'
        ]

        try {
            start(processArgvEmpty)
        } catch (err) {
            expect(err.message).to.equal('Must use a command!')
            done()
        }
    })
*/
    it('#start - create command', (done) => {

        start(processArgvToCreate, (err, res) => {
            expect(err).to.equal(null)
            checkNewProject()
            done()
        })
    })

    it('#start - create and add command', (done) => {

        start(processArgvToCreate, (err, res) => {
            expect(err).to.equal(null)
            checkNewProject()

            const processArgvToAdd = [
                'node', 'src/index.js',
                'add',
                '--sourceDir', path.resolve(testDirectory, testProjectName),
                '--type', 'OPERATION',
                '--path', 'newservice',
                '--uriTemplate', '/newservice',
                '--name', 'New Service',
                '--desc', 'Description of new service'
            ]

            start(processArgvToAdd, (err, res) => {
                expect(err).to.equal(null)
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedAddResult = loadJsonFileSync('src/commands/fixtures/expectedAddResult.yml')
                expect(results).to.eql(expectedAddResult)
                done()
            })
        })
    })


    it('#start - create and add-bulk command', (done) => {

        start(processArgvToCreate, (err, res) => {
            expect(err).to.equal(null)
            checkNewProject()

            const processArgvToAddBulk = [
                'node', 'src/index.js',
                'add-bulk',
                '--sourceDir', path.resolve(testDirectory, testProjectName),
                '--services', 'src/commands/fixtures/bulkServices.yml'
            ]

            start(processArgvToAddBulk, (err, res) => {
                expect(err).to.equal(null)
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedAddBulkResult = loadJsonFileSync('src/commands/fixtures/expectedAddBulkResult.yml')
                expect(results).to.eql(expectedAddBulkResult)
                done()
            })
        })
    })

    it('#start - create and docs command', (done) => {

        start(processArgvToCreate, (err, res) => {
            expect(err).to.equal(null)
            checkNewProject()

            const processArgvToDocs = [
                'node', 'src/index.js',
                'docs',
                '--sourceDir', path.resolve(testDirectory, testProjectName),
                '--docsTargetDir', path.resolve(testDirectory, testProjectName, 'docs')
            ]

            start(processArgvToDocs, (err, res) => {
                expect(err).to.equal(null)
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedDocsResult = loadJsonFileSync('src/commands/fixtures/expectedDocsResult.yml')
                expect(results).to.eql(expectedDocsResult)
                done()
            })
        })
    })

    it('#start - create and tests command', (done) => {

        start(processArgvToCreate, (err, res) => {
            expect(err).to.equal(null)
            checkNewProject()

            const processArgvToTests = [
                'node', 'src/index.js',
                'test',
                '--sourceDir', path.resolve(testDirectory, testProjectName),
                '--testsTargetDir', path.resolve(testDirectory, testProjectName, 'tests'),
                '--endpoints', 'services'            ]

            start(processArgvToTests, (err, res) => {
                expect(err).to.equal(null)
                const results = findFilesSync(testDirectory, /.*/, true, true)
                const expectedTestsResult = loadJsonFileSync('src/commands/fixtures/expectedTestsResult.yml')
                expect(results).to.eql(expectedTestsResult)
                done()
            })
        })
    })
})

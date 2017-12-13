import { expect } from 'chai'
import defaults from './config'
import cli from './cli'

before(done => {
    done()
})

after(done => {
    done()
})

describe('cli', () => {

    it('create', done => {
        const processArgv = ['node', 'src/index.js', 'create', '-n', 'newProject', '-v', 'v1.0.0', '-a', 'tombenke'];
        const expected = {
            command: {
                name: 'create',
                args: { projectName: 'newProject', apiVersion: 'v1.0.0', author: 'tombenke' }
            },
            cliConfig: {}
        }
        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('add', done => {
        const processArgv = [
            'node',
            'src/index.js',
            'add',
            '--type', 'OPERATION',
            '--path', 'newservice',
            '--uriTemplate', '/newservice',
            '--name', 'New Service',
            '--desc', 'Description of new service'
        ]

        const expected = {
            command: {
                name: 'add',
                args: {
                    type: 'OPERATION',
                    path: 'newservice',
                    uriTemplate: '/newservice',
                    name: 'New Service',
                    desc: 'Description of new service'
                }
            },
            cliConfig: {
                "configFileName": "config.yml",
                "endpoints": "services",
                "sourceDir": process.cwd()
            }
        }
        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('addBulk', done => {
        const processArgv = [
            'node',
            'src/index.js',
            'add-bulk',
            '--sourceDir', process.cwd(),
            '--services', 'bulkServices.yml'
        ]

        const expected = {
            command: {
                name: 'addBulk',
                args: {
                    services: 'bulkServices.yml'
                }
            },
            cliConfig: {
                configFileName: 'config.yml',
                sourceDir: process.cwd(),
                endpoints: 'services'
            }
        }
        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('docs', done => {
        const processArgv = [
            'node',
            'src/index.js',
            'docs',
            '--sourceDir', process.cwd()
        ]

        const expected = {
            command: {
                name: 'docs',
                args: {
                }
            },
            cliConfig: {
                apiVersion: "1.0.0",
                configFileName: 'config.yml',
                docsTargetDir: process.cwd() + "/docs",
                sourceDir: process.cwd(),
                endpoints: 'services',
                projectName: "noname"
            }
        }
        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('test', done => {
        const processArgv = [
            'node',
            'src/index.js',
            'test',
            '--sourceDir', process.cwd()
        ]

        const expected = {
            command: {
                name: 'test',
                args: {
                }
            },
            cliConfig: {
                configFileName: 'config.yml',
                testsTargetDir: process.cwd() + "/tests",
                testTemplates: process.cwd() + "/templates/test",
                sourceDir: process.cwd(),
                endpoints: 'services'
            }
        }
        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})

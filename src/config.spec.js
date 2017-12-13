import { expect } from 'chai'
import config from './config'
import path from 'path'
import thisPackage from '../package.json'

before(done => { done() })
after(done => { done() })

describe('config', () => {

    it('defaults', done => {
        const expected = {
            app: {
                name: thisPackage.name,
                version: thisPackage.version
            },
            configFileName: 'config.yml',
            logLevel: 'info',
            endpoints: "services",
            docsTargetDir: path.resolve(__dirname, "../docs"),
            docsTemplates: path.resolve(__dirname, "../templates/docs"),
            projectTemplates: path.resolve(__dirname, "../templates/project"),
            serverTemplates: path.resolve(__dirname, "../templates/server"),
            servicesTemplates: path.resolve(__dirname, "../templates/services"),
            sourceDir: path.resolve(__dirname, '../'),
            testTemplates: path.resolve(__dirname, "../templates/test"),
            testsTargetDir: path.resolve(__dirname, "../tests")
        }
        
        const defaults = config
        expect(defaults).to.eql(expected)
        done()
    })
})

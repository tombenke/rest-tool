'use strict';

var _chai = require('chai');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});

after(function (done) {
    done();
});

describe('cli', function () {

    it('create', function (done) {
        var processArgv = ['node', 'src/index.js', 'create', '-n', 'newProject', '-v', 'v1.0.0', '-a', 'tombenke'];
        var expected = {
            command: {
                name: 'create',
                args: { projectName: 'newProject', apiVersion: 'v1.0.0', author: 'tombenke' }
            },
            cliConfig: {
                sourceDir: process.cwd()
            }
        };
        (0, _chai.expect)(_cli2.default.parse(_config2.default, processArgv)).to.eql(expected);
        done();
    });

    it('add', function (done) {
        var processArgv = ['node', 'src/index.js', 'add', '--type', 'OPERATION', '--path', 'newservice', '--uriTemplate', '/newservice', '--name', 'New Service', '--desc', 'Description of new service'];

        var expected = {
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
        };
        (0, _chai.expect)(_cli2.default.parse(_config2.default, processArgv)).to.eql(expected);
        done();
    });

    it('addBulk', function (done) {
        var processArgv = ['node', 'src/index.js', 'add-bulk', '--sourceDir', process.cwd(), '--services', 'bulkServices.yml'];

        var expected = {
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
        };
        (0, _chai.expect)(_cli2.default.parse(_config2.default, processArgv)).to.eql(expected);
        done();
    });

    it('docs', function (done) {
        var processArgv = ['node', 'src/index.js', 'docs', '--sourceDir', process.cwd()];

        var expected = {
            command: {
                name: 'docs',
                args: {}
            },
            cliConfig: {
                apiVersion: "1.0.0",
                configFileName: 'config.yml',
                docsTargetDir: process.cwd() + "/docs",
                sourceDir: process.cwd(),
                endpoints: 'services',
                projectName: "noname"
            }
        };
        (0, _chai.expect)(_cli2.default.parse(_config2.default, processArgv)).to.eql(expected);
        done();
    });

    it('test', function (done) {
        var processArgv = ['node', 'src/index.js', 'test', '--sourceDir', process.cwd()];

        var expected = {
            command: {
                name: 'test',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                testsTargetDir: process.cwd() + "/tests",
                testTemplates: process.cwd() + "/templates/test",
                sourceDir: process.cwd(),
                endpoints: 'services'
            }
        };
        (0, _chai.expect)(_cli2.default.parse(_config2.default, processArgv)).to.eql(expected);
        done();
    });
});
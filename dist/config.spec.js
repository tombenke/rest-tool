'use strict';

var _chai = require('chai');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});
after(function (done) {
    done();
});

describe('config', function () {

    it('defaults', function (done) {
        var expected = {
            app: {
                name: _package2.default.name,
                version: _package2.default.version
            },
            configFileName: 'config.yml',
            logLevel: 'info',
            endpoints: "services",
            docsTargetDir: _path2.default.resolve(__dirname, "../docs"),
            docsTemplates: _path2.default.resolve(__dirname, "../templates/docs"),
            projectTemplates: _path2.default.resolve(__dirname, "../templates/project"),
            serverTemplates: _path2.default.resolve(__dirname, "../templates/server"),
            servicesTemplates: _path2.default.resolve(__dirname, "../templates/services"),
            sourceDir: _path2.default.resolve(__dirname, '../'),
            testTemplates: _path2.default.resolve(__dirname, "../templates/test"),
            testsTargetDir: _path2.default.resolve(__dirname, "../tests")
        };

        var defaults = _config2.default;
        (0, _chai.expect)(defaults).to.eql(expected);
        done();
    });
});
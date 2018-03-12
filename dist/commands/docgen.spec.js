'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chai = require('chai');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _datafile = require('datafile');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index');

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('docgen', function () {

    var testDirectory = _path2.default.resolve('./tmp');
    var testProjectName = 'testProject';

    var createContainer = {
        config: _.merge({}, _config2.default, { sourceDir: testDirectory })
    };
    var createCommand = {
        name: 'create',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    };

    var docsContainer = {
        logger: console,
        config: _.merge({}, _config2.default, {
            sourceDir: _path2.default.resolve(testDirectory, testProjectName),
            docsTargetDir: _path2.default.resolve(testDirectory, testProjectName, 'docs')
        })
    };

    var docsCommand = {
        name: 'docs',
        args: {}
    };

    var destCleanup = function destCleanup(cb) {
        var dest = testDirectory;
        (0, _rimraf2.default)(dest, cb);
    };

    beforeEach(function (done) {
        destCleanup(function () {
            _fs2.default.mkdirSync(testDirectory);
            done();
        });
    });

    afterEach(function (done) {
        destCleanup(done);
    });

    it('docs - with defaults', function (done) {
        var executives = { create: _index.create, docs: _index.docs };
        _npac2.default.runJobSync(createContainer.config, executives, createCommand, function (err, res) {
            var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
            var expectedCreateResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedCreateResult.yml');
            (0, _chai.expect)(results).to.eql(expectedCreateResult);
            done();

            var config = docsContainer.config;
            _npac2.default.runJobSync(config, executives, docsCommand, function (err, res) {
                var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
                var expectedDocsResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedDocsResult.yml');
                (0, _chai.expect)(results).to.eql(expecteddocsResult);
                done();
            });
        });
    });
});
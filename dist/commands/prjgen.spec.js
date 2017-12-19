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

var _prjgen = require('./prjgen');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testDirectory = _path2.default.resolve('./tmp');

var destCleanup = function destCleanup(cb) {
    var dest = testDirectory;
    console.log('Remove: ', dest);
    (0, _rimraf2.default)(dest, cb);
};

describe('prjgen', function () {

    before(function (done) {
        destCleanup(function () {
            console.log('Create: ', testDirectory);
            _fs2.default.mkdirSync(testDirectory);
            done();
        });
    });

    after(function (done) {
        destCleanup(done);
    });

    it('create - with default config', function (done) {
        var container = {
            config: _.merge({}, _config2.default, { sourceDir: testDirectory })
        };
        var command = {
            name: 'create',
            args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
        };
        (0, _prjgen.create)(container, command.args);
        var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
        var expectedCreateResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedCreateResult.yml');
        (0, _chai.expect)(results).to.eql(expectedCreateResult);
        done();
    });
});
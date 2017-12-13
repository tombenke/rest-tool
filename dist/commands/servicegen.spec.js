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

describe('servicegen', function () {

    var testDirectory = _path2.default.resolve('./tmp');
    var testProjectName = 'testProject';

    var createContainer = {
        config: _.merge({}, _config2.default, { sourceDir: testDirectory })
    };
    var createCommand = {
        name: 'create',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    };

    var addContainer = {
        config: _.merge({}, _config2.default, { sourceDir: _path2.default.resolve(testDirectory, testProjectName) })
    };
    var addCommand = {
        name: 'add',
        args: { projectName: 'testProject', apiVersion: '1.2.3', author: 'testuser' }
    };

    var destCleanup = function destCleanup(cb) {
        var dest = testDirectory;
        console.log('Remove: ', dest);
        (0, _rimraf2.default)(dest, cb);
    };

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

    it('add - with defaults', function (done) {
        // rest-tool create -sourceDir ./tmp/ -n testProject -v "1.2.3" -a testuser
        (0, _prjgen.create)(createContainer, createCommand);
        var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
        (0, _chai.expect)(results).to.eql(['/testProject/README.md', '/testProject/index.js', '/testProject/package.json', '/testProject/services/monitoring/isAlive/service.yml']);

        // rest-tool add --sourceDir ./tmp/testProject/ -p newservice -u /newservice -n "New Service" -d "Description of new service"
        add(addContainer, addCommand);
        done();
    });
});
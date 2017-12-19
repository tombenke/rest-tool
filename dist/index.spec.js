'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chai = require('chai');

var _datafile = require('datafile');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testDirectory = _path2.default.resolve('./tmp');

var destCleanup = function destCleanup(cb) {
    var dest = testDirectory;
    console.log('Remove: ', dest);
    (0, _rimraf2.default)(dest, cb);
};

describe('app', function () {

    before(function (done) {
        destCleanup(function () {
            console.log('Create: ', testDirectory);
            _fs2.default.mkdirSync(testDirectory);
            done();
        });
    });

    after(function (done) {
        destCleanup(done);
        //        done()
    });

    var testProjectName = 'testProject';
    var processArgvToCreate = ['node', 'src/index.js', 'create', '--sourceDir', testDirectory, '-n', testProjectName, '-v', 'v1.0.0', '-a', 'tombenke'];

    var checkNewProject = function checkNewProject() {
        var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
        var expectedCreateResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedCreateResult.yml');
        (0, _chai.expect)(results).to.eql(expectedCreateResult);
    };
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
    it('#start - create command', function (done) {

        (0, _index.start)(processArgvToCreate, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            checkNewProject();
            done();
        });
    });

    it('#start - create and add command', function (done) {

        (0, _index.start)(processArgvToCreate, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            checkNewProject();

            var processArgvToAdd = ['node', 'src/index.js', 'add', '--sourceDir', _path2.default.resolve(testDirectory, testProjectName), '--type', 'OPERATION', '--path', 'newservice', '--uriTemplate', '/newservice', '--name', 'New Service', '--desc', 'Description of new service'];

            (0, _index.start)(processArgvToAdd, function (err, res) {
                (0, _chai.expect)(err).to.equal(null);
                var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
                var expectedAddResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedAddResult.yml');
                (0, _chai.expect)(results).to.eql(expectedAddResult);
                done();
            });
        });
    });

    it('#start - create and add-bulk command', function (done) {

        (0, _index.start)(processArgvToCreate, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            checkNewProject();

            var processArgvToAddBulk = ['node', 'src/index.js', 'add-bulk', '--sourceDir', _path2.default.resolve(testDirectory, testProjectName), '--services', 'src/commands/fixtures/bulkServices.yml'];

            (0, _index.start)(processArgvToAddBulk, function (err, res) {
                (0, _chai.expect)(err).to.equal(null);
                var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
                var expectedAddBulkResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedAddBulkResult.yml');
                (0, _chai.expect)(results).to.eql(expectedAddBulkResult);
                done();
            });
        });
    });

    it('#start - create and docs command', function (done) {

        (0, _index.start)(processArgvToCreate, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            checkNewProject();

            var processArgvToDocs = ['node', 'src/index.js', 'docs', '--sourceDir', _path2.default.resolve(testDirectory, testProjectName), '--docsTargetDir', _path2.default.resolve(testDirectory, testProjectName, 'docs')];

            (0, _index.start)(processArgvToDocs, function (err, res) {
                (0, _chai.expect)(err).to.equal(null);
                var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
                var expectedDocsResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedDocsResult.yml');
                (0, _chai.expect)(results).to.eql(expectedDocsResult);
                done();
            });
        });
    });

    it('#start - create and tests command', function (done) {

        (0, _index.start)(processArgvToCreate, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            checkNewProject();

            var processArgvToTests = ['node', 'src/index.js', 'test', '--sourceDir', _path2.default.resolve(testDirectory, testProjectName), '--testsTargetDir', _path2.default.resolve(testDirectory, testProjectName, 'tests'), '--endpoints', 'services'];

            (0, _index.start)(processArgvToTests, function (err, res) {
                (0, _chai.expect)(err).to.equal(null);
                var results = (0, _datafile.findFilesSync)(testDirectory, /.*/, true, true);
                var expectedTestsResult = (0, _datafile.loadJsonFileSync)('src/commands/fixtures/expectedTestsResult.yml');
                (0, _chai.expect)(results).to.eql(expectedTestsResult);
                done();
            });
        });
    });
});
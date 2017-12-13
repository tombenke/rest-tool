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

    it('create ', function (done) {
        var processArgv = ['node', 'src/index.js', 'create', '-n', 'newProject', '-v', 'v1.0.0', '-a', 'tombenke'];
        var expected = {
            command: {
                name: 'create',
                args: { projectName: 'newProject', apiVersion: 'v1.0.0', author: 'tombenke' }
            },
            cliConfig: {}
        };
        var defaults = _config2.default;
        console.log('defaults: ', defaults /*, cli.parse(defaults, processArgv)*/);
        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });
});
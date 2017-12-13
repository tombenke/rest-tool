var baseUrl = process.env.SERVER_BASE_URL || 'http://localhost:3007'
var user = process.env.TEST_USERNAME || 'testuser'
var pass = process.env.TEST_PASSWORD || 'secret'

var request = require('superagent'),
    should = require('should'),
    mocha = require('mocha');

describe('{{description}}', function() {
    var agent = request.agent();

    it('should {{description}}', function(done) {
        agent
            .get(baseUrl+'{{url}}')
            .auth(user, pass)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                should.not.exist(err);
                res.should.have.status({{response.statusCode}});
                res.should.have.property('body');
                // FIXME add further checks if appropriate
                {{#response.validationSchema}}
                var path = require('path');
                var JaySchema = require('jayschema');
                var js = new JaySchema(JaySchema.loaders.http);
                var schema = require(path.resolve('{{contentPath}}', '{{response.validationSchema}}'));
                js.validate(res.body, schema, function(errs) {
                    should.not.exist(errs);
                    done();
                });
                {{/response.validationSchema}}
                {{^response.validationSchema}}done();{{/response.validationSchema}}
            });
    });
});

## Testing the api

### Generate test cases

Before you run the tests, you have to generate/update the test cases.
You can do this with the following command:

    $ rest-tool test --update --overwrite

The `--overwrite` option tells the tool to overwrite the existing cases, otherwise it will keep they if they exist yet.

During the generation process the `rest-tool` load all the services and builds an internal tree-like data structure, which represents every __service/method/test-case__. The rest tool traverses this structure, and puts each test-case into the template that is referred by that given instance. The results are put into the __test__ folder.

### Run test cases

After the test cases is generated, you can run the tests, directly from the command line, or by the continuous integration server. Use one of the following commands:

    $ make test

or

    $ mocha

To select the appropriate reporting format for the continuous integration environment, modify the `Makefile`:

    REPORTER ?= spec

    test:
        @node_modules/.bin/mocha --reporter $(REPORTER)

    .PHONY: test


### Add new test-case templates

You can use your own test programs, which can be built from the service descriptors. Only the templates should be written and placed into the `templates/test` folder, and must be referred from the test cases using the `template` property. For example: `template: testGetMethod.mustache`.

The following code example shows the `testGetMethod.mustache` template, which is used for basic testing of GET requests:

    var request = require('superagent'),
        should = require('should'),
        mocha = require('mocha');

    describe('{{description}}', function() {
        var agent = request.agent();

        it('should {{description}}', function(done) {
            agent
                .get('{{baseUrl}}{{url}}')
                {{#loginCredentials}}.auth('{{user}}',
                   '{{pass}}'){{/loginCredentials}}
                .set('Accept', 'application/json')
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.have.status({{response.statusCode}});
                    res.should.have.property('body');
                    // FIXME add further checks if appropriate
                    {{#jsonschema}}
                    var path = require('path');
                    var JaySchema = require('jayschema');
                    var js = new JaySchema(JaySchema.loaders.http);
                    var schema = require(path.join(__dirname,
                        '..', 'schemas', '{{jsonschema}}.json'));
                    js.validate(res.body, schema, function(errs) {
                        should.not.exist(errs);
                        done();
                    });
                    {{/jsonschema}}
                    {{^jsonschema}}done();{{/jsonschema}}
                });
        });
    });

The code using this template with the `monitoring/isAlive/service.yml` service descriptor will be generate into the `test/Get Monitoring Is Alive.js` file, looks like this:

    var request = require('superagent'),
        should = require('should'),
        mocha = require('mocha');

    describe('Successfully checks if server is alive', function() {
        var agent = request.agent();

        it('should Successfully checks if server is alive', function(done) {
            agent
                .get('http://localhost:3007/rest/monitoring/isAlive')
                .auth('username', 'password')
                .set('Accept', 'application/json')
                .end(function(err, res) {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.should.have.property('body');
                    // FIXME add further checks if appropriate
                    
                    done();
                });
        });
    });

<!-- TODO:
    - Add link to Mu2, and mustache doc pages.
    - Add details to internal structure of testCases during template usage.
    - Add link to rest-tool-common doc pages.
-->

During the test-case generation process, each template got the whole service description, and some additional data. 

In case you would like to extend the template set of your test cases (for example to add JSON or XML validation), you should execute the following steps:

1. Write a working sample test case, and try it to make sure, that is working properly.
2. Make a mustache template from it, and put into the `templates/test` folder.
3. Refer to it in the `service.yml` files using the `template` property of the testCases.

It also means that you can write test cases in any programming language (Java, Ruby, Perl, etc.). So for example it is possible to generate JUnit test cases into your Java project, and run them on a Continuous Integration server.  

<!-- TODO: describe additional fields for test-case generation. -->

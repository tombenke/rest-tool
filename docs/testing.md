## Testing the api

### Generate test cases

Before you run the tests, you have to generate/update the test cases.
You can do this with the following command:

    $ rest-tool test --update --overwrite

The `--overwrite` option tells the tool to overwrite the existing cases, otherwise it will keep the if they exist yet.


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

In case you would like to extend the test cases (for example to add JSON or XML validation), you should execute the following steps:

1. Write a working sample test case, and try it to make sure, that is working properly.
2. Make a mustache template from it, and put into the `templates/test` folder.
3. Refer to it in the `service.yml` files using the `template` property of the testCases.

During the test-case generation process, each template got the whole service description, and some additional data. 

<!-- TODO: describe additional fields for test-case generation. -->

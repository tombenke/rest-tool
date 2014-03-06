## Create and maintain services

### Service definitions

The services can be specified under the `services` folder. Each service should have its own subdirectory. A service subdirectory must contain at least a `service.yml` descriptor file, and any other files, mainly JSON or XML mock data and validation schemas.

The newly created project contains a sample service descriptor such as `services/monitoring/isAlive/service.yml`.
Below you can see its (a bit shortened) content:

    name: Monitoring that server is alive
    description: |
        It is a very simple service, 
        which makes possible to monitor that the server is running
        and is able to answer HTTP requests
    style: OPERATION
    urlPattern: /monitoring/isAlive
    methods:
        GET:
            summary: Is server alive?
            notes: Responses true if server is working
            # implementation: monitoring.isAlive
            request:
                parameters: []
                cookies: []
                headers: []
            responses:
                -
                    name: OK
                    statusCode: &OkStatusCode 200
                    reason: &OkReason Successful execution
                    cookies: []
                    headers: []
                    mockBody: &OkMockBody getMonitoringIsAlive-responseBody.json
            testCases:
                -
                    name: Get Monitoring Is Alive
                    description: Successfully checks if server is alive
                    url: /monitoring/isAlive
                    template: testGetMethod.mustache
                    request:
                        parameters: []
                        cookies: []
                        headers: []
                    response:
                        name: OK
                        statusCode: *OkStatusCode
                        reason: *OkReason
                        cookies: []
                        headers: []
                    mockBody: *OkMockBody

The sample service descriptor defines a service, which is able to response to GET requests, and the response will be the content of the `getMonitoringIsAlive-responseBody.json` file placed into the same directory where the `service.yml` is there, as the `mockBody` property determines.

The response also could be dynamically created by implementing it in JavaScript. The `implementation` property of the request identifies the module and function of the code which defines the behaviour of the service. At the moment it is commented out using the `#` character, because only one of `mockBody` or `implementation` can exist.

You also can observe the usage of referencing feature provided by YAML. For example the value of the `mockBody` property of the `OK` response is labeled with `&OkMockBody` and referenced by `*OkMockBody` from the test-case. This allows you to define the mock file name that is `getMonitoringIsAlive-responseBody.json` only once, and refer to it anywhere in the same file. 

This sample desciptor file also can be used as a baseline to write your own definitions. 

### The structure of the service.yml file

The top-level structure of a service descriptor is the following:

- __name:__
  _(mandatory, string)_  
  The name of the service.

  For example: `Monitoring that server is alive`

- __description:__
  _(mandatory, string)_  
  Short desciption of the service.

  For example: `It is a very simple service, which makes possible to...`

- __style:__
  _(mandatory, string)_  
  Tells whether it is an RPC-like OPERATION,
  or a RESOURCE, which fully comply to the REST principles

  Possible values: OPERATION | COLLECTION | RESOURCE

- __urlPattern:__
  _(mandatory, string)_  
  The URL pattern of the service.

  For example: `/monitoring/isAlive`.

- __methods:__
  _(mandatory, array)_  
  The methods of the service specification.
  There must be at least one method defined for the resource.

  Currently only the most fundamental methods (GET, PUT, POST, DELETE) are provided.

  The internal structure of every method is the following:
    - __summary:__
      _(mandatory, string)_  
        Short summary of the service method.

    - __notes:__  
      _(optional, string)_  
        Details and notes about the method.

    - __implementation:__  
      _(optional, string)_  
        The implementation of the call in the following format:
        `<module>.<function>`. For details see the ["Implement dynamic mocking behaviour"](server.html#implement-dynamic-mocking-behaviour) section.

        For example: `monitoring.isalive`

    - __request:__  
      _(mandatory, object)_  
        The detailed specification of request.

    - __responses:__  
      _(mandatory, array)_  
        The detailed specification of responses.
        There can be several possible responses, 
        but at least one `OK` response must be defined.

    - __testCases:__  
        The detailed specification of test cases.
        A method can contain zero or more test cases.

In the whole service descriptor, you can use multiline text in case of string-type fields. moreover you can use [Markdown](http://daringfireball.net/projects/markdown/) format text in fields named such as: 'description', 'summary' and 'details'.

<!--
TODO:
    - Cite REST principles and application patterns
    - Add book references
    - Describe the differences among
        - request
        - responses
        - testCases
    - Add links to relevant cookbook pages
-->

Similar to the validation of the `config.yml`, when the server is started, or the generator is used, they check the validity of the `service.yml` files too, so you might get error messages in case of wrong format or missing properties.

To see the detailed structure description of the service descriptor file, study the corresponding JSON validation schema files in the `rest-tool-common` module:
- [serviceSchema.yml](https://github.com/tombenke/rest-tool-common/blob/master/schemas/serviceSchema.yml)
- [requestParametersSchema.yml](https://github.com/tombenke/rest-tool-common/blob/master/schemas/requestParametersSchema.yml)
- [headersSchema.yml](https://github.com/tombenke/rest-tool-common/blob/master/schemas/headersSchema.yml)
- [cookiesSchema.yml](https://github.com/tombenke/rest-tool-common/blob/master/schemas/cookiesSchema.yml)
- [testCaseSchema.yml](https://github.com/tombenke/rest-tool-common/blob/master/schemas/testCaseSchema.yml)

These properties are all available during the documentation and test case generation process in the templates. It is also possible to place additional properties beside the mandatory ones, and they also can be used in templates, so you can customize your documentation or test cases using your own extensional data just like in case of the central `config.yml` file.

### Create new services

#### Add new service to the project

You can create a new service either manually creating and editing `service.yml` files, or using the `rest-tool` with the `add` and/or `add-bulk` command.

To add one service, you can use the `rest-tool add` command:

    $ rest-tool add -h

      Usage: add [options]

      Options:

        -h, --help                     output usage information
        -t, --type [type]              Defines the type (OPERATION|COLLECTION|RESOURCE) of the service (default: RESOURCE)
        -p, --path <path>              The path of the service description relative to project-root/service/
        -u, --urlPattern <urlPattern>  The unique URL pattern of the service
        -n, --name <name>              The name of the operation/collection/resource
        -d, --desc <desc>              The description of the service
        -c, --config [configFileName]  The name of the configuration file (default: config.yml)
        -v, --verbose                  Verbose mode


For example, to create a collection manager service, execute the following command:

    $ rest-tool add -t COLLECTION \
        -p customers \
        -u /customers \
        -n Customers \
        -d "A service to manage the collection of customers"

#### Service stereotypes

TBD:
- operation
- collection
- resource


#### Add new service to the project in bulk mode

It is also possible to create more than one service in one step with the `rest-tool add-bulk` command:

    $ rest-tool add-bulk -h

      Usage: add-bulk [options]

      Options:

        -h, --help                     output usage information
        -s, --services [services]      The filename of which contains the list of services to create (for example: bulk.json)
        -c, --config [configFileName]  The name of the configuration file (default: config.yml)
        -v, --verbose                  Verbose mode

<!-- TODO: Show example, and demo bulk config file -->

### Configure the services

The service descriptors you create will not be activated automatically. You have to manually list them under the `services` property of the `config.yml` file:

    services:
        - /monitoring/isAlive
        # To add new services, put here the path of the directory
        # that contains the service.yml

This way, you can write your new services until they will be stable enough to activate them, and they will be loaded and start working only if you have added them to the config file.

### Create mock data

Just simply put any files beside the `service.yml` and refer to them using the `mockBody` fields in the service descriptor.

### Validation
TBD.

### Create dynamic services

The service descriptor either contains `mockBody` properties under the response and test case objects that refer to mock data files, or it contains an `implementation` property of the `request` object. In this latter case you can call a server module, with your own implementation.  

For more detaions see the [Implement dynamic mocking behaviour](server.html#implement-dynamic-mocking-behaviour) section.

If none ot these properties are defined, the service is responding a JSON object, that is the service descriptor itself by default, in order to show the server is listening to the given URL.

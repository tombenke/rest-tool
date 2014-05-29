## Create and maintain services

### Service definitions

If you have never defined RESTful services yet, then you might find useful the books and other readings listed in the [References](references.html).

The services can be specified under the `services` folder. Each service should have its own subdirectory. A service subdirectory must contain at least a `service.yml` descriptor file, and any other files, mainly JSON or XML mock data and validation schemas.

The newly created project contains a sample service descriptor such as `services/monitoring/isAlive/service.yml`.
Below you can see its (a bit shortened) content:

    name: Monitoring that server is alive
    description: |
        It is a very simple service, 
        which makes possible to monitor that the server is running
        and is able to answer HTTP requests
    style: OPERATION
    uriTemplate: /monitoring/isAlive
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

The response also could be dynamically created by implementing it in JavaScript. The `implementation` property of the request identifies the module and function of the code which defines the behavior of the service. At the moment it is commented out using the `#` character, because only one of `mockBody` or `implementation` can exist.

You also can observe the usage of referencing feature provided by YAML. For example the value of the `mockBody` property of the `OK` response is labeled with `&OkMockBody` and referenced by `*OkMockBody` from the test-case. This allows you to define the mock file name that is `getMonitoringIsAlive-responseBody.json` only once, and refer to it anywhere in the same file. 

This sample descriptor file also can be used as a baseline to write your own definitions. 

### The structure of the service.yml file

This section describes the structure of the `service.yml` file, and the meaning of its properties.

In the whole service descriptor, you can use multi-line text in case of string-type fields. Moreover you can use [Markdown](http://daringfireball.net/projects/markdown/) format text in fields named such as: 'description', 'summary' and 'details'.

The top-level structure of a service descriptor is the following:

- __name:__
  _(mandatory, string)_  
  The name of the service.

  For example: `Monitoring that server is alive`

- __description:__
  _(mandatory, string)_  
  Short description of the service.

  For example: `It is a very simple service, which makes possible to...`

- __style:__
  _(optional, string)_  
  Tells whether it is an RPC-like OPERATION,
  or a RESOURCE, which fully comply to the REST principles

  Possible values: OPERATION | COLLECTION | RESOURCE

  Default: OPERATION

- __urlPattern:__
  _(deprecated)_  
  Use the __uriTemplate__ instead of it.

- __uriTemplate:__
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
        `<module>.<function>`. For details see the ["Implement dynamic mocking behavior"](server.html#implement-dynamic-mocking-behavior) section.

        For example: `monitoring.isalive`

    - __request:__  
      _(optional, object)_  
        The detailed specification of request.

    - __responses:__  
      _(mandatory, array)_  
        The detailed specification of responses.
        There can be several possible responses, 
        but at least one `OK` response must be defined.

    - __testCases:__  
      _(optional, array)_  
        The detailed specification of test cases.
        A method can contain zero or more test cases.
        Default: an empty array

Every __method__ must have a __request__ property which describes the main attributes of the method to the given URL:

- __parameters:__
  _(optional, array)_  
  An array of request parameter descriptors.
  Specification of the request parameters:
    - __name:__
        _(mandatory, string)_  
        The name of the parameter.
    - __kind:__
        _(mandatory, enum: URL, QUERY, BODY)_  
        Tells where the parameter is placed.
    - __required:__
        _(mandatory, boolean)_  
        Tells if the parameter is mandatory.
    - __type:__
        _(mandatory, enum: string, number, boolean, object, array)_  
        Defines the type of the parameter
    - __summary:__
        _(mandatory, string)_  
        Short summary of the parameter.
    - __default:__
        _(optional, anyOf: string, number, boolean, object "null")_  
        Default value of the parameter.

  Default: an empty array

- __headers:__
  _(optional, array)_  
  Specification of the headers.
    - __field:__
      _(mandatory, string)_  
      The header field name.
    - __content:__
      _(mandatory, string)_  
      The header content.

  Default: an empty array

- __cookies:__
  _(optional, array)_  
  Specification of the cookies.
    - __field:__
      _(mandatory, string)_  
      The cookie field name.
    - __content:__
      _(mandatory, string)_  
      The cookie content.

  Default: an empty array

- __mockBody:__
  _(optional, string)_  
  The path to the file which contain the mock request body.
  For example: `postOperation-requestBody.json`.

Every __method__ must have a __responses__ array property which describes the main attributes of the possible responses to the request of the given URL. At least an `OK` response must exist. Each response has the following structure:

- __name:__
  _(mandatory, string)_  
  The name of the response.
  At least one 'OK' response must be defined.
- __statusCode:__
  _(mandatory, string | integer)_  
  The status code of the response
- __reason:__
  _(mandatory, string)_  
  The reason of the status code
- __description:__
  _(mandatory, string | "null")_  
  Details and notes about the response
- __validationSchema:__
  _(mandatory, string)_  
  The JSON-schema to validate the content of the response
  for example: getMonitoringIsAlive-responseBody-validationSchema.json
- __cookies:__
  _(optional, array)_  
  The definitions of the response cookies.  
  Default: an empty array  
  (See also: request.cookies).
- __headers:__
  _(optional, array)_  
  The definitions of the response headers.  
  Default: an empty array  
  (See also: request.headers).
- __mockBody:__
  _(optional, string)_  
  The path to the file which contain the mock response body.
  For example: getMonitoringIsAlive-responseBody.json

Every __method__ can have a __testCases__ array property which describes the main attributes of the individual test cases to the request of the given URL. Each __testCase__ has the following structure:

- __name:__
  _(mandatory, string)_  
  The name of the test case.
- __description:__
  _(mandatory, string)_  
  The description of the test case.
- __url:__
  _(mandatory, string)_  
  The URL of the test case.
- __template:__
  _(mandatory, string)_  
  The path to the template which is used to generate the test case.
  for example: testGetMethod.mustache.
- __request:__
  _(optional, object)_  
  The specification of the request of the test case.
    - __cookies:__
      _(optional, array)_  
      Default: an empty array.  
      (See also: request.cookies).
    - __headers:__
      _(optional, array)_  
      Default: an empty array.  
      (See also: request.headers).
    - __mockBody:__
      _(optional, string)_  
      The path to the file which contain the mock request body.
      For example: postOperation-requestBody.json
- __response:__
  _(mandatory, object)_  
  The specification of the response of the test case.
    - __statusCode:__
      The status code of the response.
    - __validationSchema:__
     _(optional, string)_  
      The JSON-schema to validate the content of the response.
      for example: `getMonitoringIsAlive-responseBody-validationSchema.json`.
    - __cookies:__
     _(optional, array)_  
      The definitions of the response cookies.  
      Default: an empty array.  
      (See also: request.cookies).
    - __headers:__
     _(optional, array)_  
      The definitions of the response headers.  
      Default: an empty array.  
      (See also: request.headers).
    - __mockBody:__
     _(optional, string)_  
      The path to the file which contain the mock response body.
      For example: `getMonitoringIsAlive-responseBody.json`.

<!--
TODO:
    - Cite REST principles and application patterns
    - Add book references
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

#### Service stereotypes

The `rest-tool` divides the services into two main classes: 

- __RPC-like services:__
  These are RPC-like calls through HTTP requests/responses. Typically using POST methods with complex body content. Such kind of services are identified by the `OPERATION` style.
- __Resource oriented (or RESTful) services:__
  These are further divided into two classes:
  - Collection manager services:
    These services are executing the CRUD operations on arrays of individual resources, and labelled with the `COLLECTION` style. The URL pattern typically looks like this: `/<collection-name>`, for example: `/customers`.
  - Resource manager services:
    These services are executing the CRUD operations on individual resources, and labelled with the `RESOURCE` style. The URL pattern typically looks like this: `/<collection-name>/<resource-id>`, for example: `/customers/0012301`.

The following table summarizes the meaning of methods in case of the `COLLECTION` style services:

<table class="table table-striped table-bordered table-condensed">
<thead><tr><th>Method</th><th>Description</th></tr></thead>
<tbody>
<tr><td>POST</td><td>Create a new Resource of collection</td></tr>
<tr><td>GET</td><td>Retrieves the whole collection</td></tr>
<tr><td>PUT</td><td>Updates the whole collection</td></tr>
<tr><td>DELETE</td><td>Delete the whole collection</td></tr>
</tbody>
</table>

The following table summarizes the meaning of methods in case of the `RESOURCE` style services:

<table class="table table-striped table-bordered table-condensed">
<thead><tr><th>Method</th><th>Description</th></tr></thead>
<tbody>
<tr><td>POST</td><td>Create a new sub-resource of the resource</td></tr>
<tr><td>GET</td><td>Retrieves one individual resource</td></tr>
<tr><td>PUT</td><td>Updates one individual resource</td></tr>
<tr><td>DELETE</td><td>Delete the identified resource</td></tr>
</tbody>
</table>

The `rest-tool` provides built-in command and templates for creating new services from any of the the tree styles mentioned above.

#### Add new service to the project

You can create a new service either manually creating and editing `service.yml` files, or using the `rest-tool` with the `add` and/or `add-bulk` command.

To add one service, you can use the `rest-tool add` command:

    $ rest-tool add -h

      Usage: add [options]

      Options:

        -h, --help                       Output usage information
        -t, --type [type]                Defines the type
                                         (OPERATION|COLLECTION|RESOURCE)
                                         of the service (default: RESOURCE)
        -p, --path <path>                The path of the service description
                                         relative to project-root/service/
        -u, --uriTemplate <uriTemplate>  The unique URL pattern of the service
        -n, --name <name>                The name of the 
                                         operation/collection/resource
        -d, --desc <desc>                The description of the service
        -c, --config [configFileName]    The name of the configuration file
                                         (default: config.yml)
        -v, --verbose                    Verbose mode


For example, to create a collection manager service, execute the following command:

    $ rest-tool add -t COLLECTION \
        -p customers \
        -u /customers \
        -n Customers \
        -d "A service to manage the collection of customers"

After the successful execution, you will find a new service under the
`project-root/services/customers` folder. You can add/edit the files under this directory according to your needs.

The service descriptors you created will be added to the `project-root/config.yml` and activated automatically.

#### Add new service to the project in bulk mode

It is also possible to create more than one service in one step with the `rest-tool add-bulk` command:

    $ rest-tool add-bulk -h

      Usage: add-bulk [options]

      Options:

        -h, --help                     output usage information
        -s, --services [services]      The filename of which contains 
                                       the list of services to create
                                       (for example: services.json)
        -c, --config [configFileName]  The name of the configuration file
                                       (default: config.yml)
        -v, --verbose                  Verbose mode

The following code fragment demonstrates a possible service list that can be used by the `add-bulk` bulk command.

    [
      {
        "type": "COLLECTION",
        "path": "/orders",
        "uriTemplate": "/orders",
        "name": "Orders",
        "description": "Order collection management",
        "methods": [
          "POST"
        ]
      },
      {
        "type": "RESOURCE",
        "path": "/orders/order",
        "uriTemplate": "/orders/order",
        "name": "Order",
        "description": "Order management",
        "methods": [
          "POST"
        ]
      },
      {
        "type": "OPERATION",
        "path": "/filterOrders",
        "uriTemplate": "/filterOrders",
        "name": "Complex order filtering",
        "description": "Complex filtering of orders collection",
        "methods": [
          "POST"
        ]
      }
    ]

If the JSON content listed above is stored into a file named `services.json`, it can be used with the following command:

    $ rest-tool add-bulk -s services.json

Similar to the normal `add` command, the newly created services will be added to the `project-root/config.yml` file.

### Configure the services

The service descriptors you create will be activated automatically, and they are listed under the `services` property of the `config.yml` file:

    services:
        - /monitoring/isAlive
        # To add new services, put here the path of the directory
        # that contains the service.yml

In case you want to disable a given service, you only have to comment that line out, or simply you can just remove it.

### Create mock data

Just simply put any files beside the `service.yml` and refer to them using the `mockBody` fields in the service descriptor.

### Validation
TBD.

<!-- TODO:
- Implement JSONSchema validation for cookbook:
  - server side
  - client side
  - static?
- and refer to it from here with some code fragments. -->

### Create dynamic services

The service descriptor either contains `mockBody` properties under the response and test case objects that refer to mock data files, or it contains an `implementation` property of the `request` object. In this latter case you can call a server module, with your own implementation.  

For more details see the [Implement dynamic mocking behavior](server.html#implement-dynamic-mocking-behavior) section.

If none of these properties are defined, the service is responding a JSON object, that is the service descriptor itself by default, in order to show the server is listening to the given URL.

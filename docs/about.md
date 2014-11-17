## About

rest-tool is simple Node.js module to document, emulate and test RESTful APIs. 

The main purpose of using 'rest-tool' is to create and maintain a well-defined REST API specification, which provides a solid basis for implementing and mocking the RESTful interface between the parties that communicates with each other through it.

This specification acts as a contract among the communicating agents either they are servers or clients.

You can do the following things with `rest-tool`:

- Create a new REST API project from scratch.
- Specify the resources (uniquely identified by their URL patterns)
  that can be provided/retrieved through the RESTful services.
- Specify the expected working of HTTP methods in relation to each resource.
- Put additional information beside the resource definitions (mock data, validation schemas, etc.)
- Use the mock Node.js server for testing, and simulating of the REST API functionality.
- Generate/Update the HTML format documentation of the REST API
- Generate/Update test cases which can be used to test either the mock server 
  and the real test/production servers to verify that the server is working according to the API.
- Use the mock server's to provide your web UI front-end source as static content 
  during the development, without the need for deployment.
- Use the mock server's proxy feature to test your web UI front-end directly against 
  3rd party application servers (JBoss, Tomcat, Apache, etc.) without deployment.
- Define your own templates to generate test cases and server side implementations 
  which best fit to your needs. (the server side templating is currently under development).

Using the tool the front-end and back-end developers can work concurrently and independently from each other. They can assure that their implementation is fully comply to the REST API specification.

The 'rest-tool' relies on the HTTP protocol specification, and NOT on language specific implementations. You can keep your communicating agents loosely coupled, and fully language agnostic.

## Documenting the REST API project

### Generate documentation

To create or update the HTMl format documentation, execute the following command:

    $ rest-tool docs --update

This will create the documentation under the `docs` folder. the HTMl documentation can be opened via a browser directly as a static file, or through the mock server, loading the following URL: (http://localhost:3007/docs/index.html).

Generate the documentation for the predefined service with the following command:

    $ rest-tool docs --update

The following files will be generated (in case of a new project):

    $ tree docs
    docs
    ├── images
    │   └── grid.png
    ├── index.html
    ├── js
    │   ├── jquery-1.9.0
    │   │   ├── jquery-1.9.0.js
    │   │   └── jquery-1.9.0.min.js
    │   └── restapidoc.js
    ├── README.md
    ├── sass
    │   ├── ie.scss
    │   ├── partials
    │   │   └── _base.scss
    │   ├── print.scss
    │   └── screen.scss
    ├── services
    │   └── monitoring
    │       └── isAlive
    │           ├── service.html
    │           └── service.yml
    └── stylesheets
        ├── ie.css
        ├── print.css
        └── screen.css


The generated documentation can be opened with a browser either as a static content 
opening the `docs/index.html` or through the server using the `http://localhost:3007/docs/` URL.


### Customize the generated documentation
TBD.
- structure
- look-and-feel


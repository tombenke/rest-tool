## Documenting the REST API project

### Generate documentation

To create or update the HTML format documentation, execute the following command:

    $ rest-tool docs --update

This will create the documentation under the `docs` folder. the HTML documentation can be opened via a browser directly as a static file, or through the mock server, loading the following URL: (http://localhost:3007/docs/index.html).

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


The generated documentation can be opened with a browser either as a static content opening the `docs/index.html` or through the server using the `http://localhost:3007/docs/index.html` URL.

A mock server implementation (`server/server.js`) contains the following middleware: 

    ...
    server.use( '/docs', express.static( __dirname + '/' + '../docs' ) );
    ...

Which allows the server to provide the documentation pages through the `/docs` URL prefix.

The intention with the links in the generated HTML pages was to make it possible to access to them both statically and through the mock server. So the documentation pages refer to each other via the `../docs` prefix, which is satisfying for both the `file://` and `http://` way of retrieving. However it might be uncomfortable if you want to provide them through a third party server (tomcat, apache, etc.) or a static file-server.

In this latter case, you can eliminate the `../docs` prefix from the service links, modifying the `project-root/templates/docs/servicesMenu.html` template file.

    <!-- Begin ServicesMenu -->
    <div id="servicesMenu">
        <div class="">Services:</div>
        <ul>
        {{#serviceDocNames}}
            <li><a href="../docs/{{relPath}}{{docFileName}}">{{name}}</a></li>
        {{/serviceDocNames}}
        </ul>
    </div>
    <!-- End of ServicesMenu -->

The following section describes the customization a bit deeper.

### Customize the generated documentation

The documentation  generation process is made of the following steps:

1. `service.yml` files are loaded.
2. An empty `docs` folder is (re)created.
3. The look-and-feel related files are copied into it from the `templates/docs` folder.
4. The whole `services` folder are also copied out to the `docs` folder.
5. Generate a `service.html` beside the corresponding `service.yml` using its content.
6. Generate the `docs/index.html` file.

To generate the `index.html` and the individual `service.html` files, the `rest-tool` is using [mustache](https://github.com/raycmorgan/Mu) templates, which are situated in the `templates/docs` folder. The templates are decomposed into partials, in order to make it easier to maintain and customize.

Each `service.html` is build from the following template/partial structure:

    restapi.html
        > service.html
            #methodList
                > method.html
                    > request.html
                        > headers.html
                        > cookies.html

                    > responses.html
                        #responses
                            > headers.html
                            > cookies.html
                        /responses

                    > testCases.html
                        #request
                            > headers.html
                            > cookies.html
                        /request

                        #response
                            > headers.html
                            > cookies.html
                        /response

            /methodList

        > servicesMenu.html
        > footer.html

The pages are using some simple JavaScript to expand and collapse the details of the services. You should modify the original files under the `docs/js` in case of necessity.

If you want to change the stylesheets of the generated documentation of the API, you will also need:

- [Sass](http://sass-lang.com/), and
- [Compass](http://compass-style.org/).

To change the CSS you most probably need to modify the `templates/docs/sass/partials/_base.scss`, then you have to compile it, to refresh the CSS files under the `templates/docs/stylesheets` folder:

    $ cd templates/docs/
    $ compass compile

The images referred by the pages or the stylesheet shoud be put into the `templates/docs/images` folder.

All the JavaScript files, images and CSS files will be copied into the (re)generated documentation with the next execution of `rest-tool docs --update` command.

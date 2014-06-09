## 0.5.0

- Change the proxy feature of the mock server:
  Replace `useRemoteServices` with `remoteServices` array of service patterns.
  The new feature allows to enable/disable the proxying of any service towards
  different remote servers/ports.

## 0.4.15

- Write some docs about how to customize the generated documentation.
- Fix: docs/index.html missing 'docs' at the beginning of url-path ~line 28 #1
  add '../docs' prefix to the links in the generated documentation files in the
  templates/docs/servicesMenu.html.

## 0.4.14

- 'add' and 'add-bulk' commands automatically register the newly created services into the config.yml
- Upgrade to rest-tool-common v0.4.2
    - Fix: add service command does not create recursively the missing directories

## 0.4.13

- Upgrade server template to rest-tool-common v0.4.1
- Replace urlPattern to uriTemplate in rest-tool.
- Fix the relative path resolution problem of loading the server/config.js.
- Add test case and sample code for add-bulk command.

## 0.4.12

- Bugfix: documentation generator rel-path does not work in Windows environment.
- Add the timestamp of last-update to the footer of the generated HTML pages.
- Some fine tuning is done on SASS classes and HTML templates.
- Add icons/classes and functions to: expand / collapse blocks.

## 0.4.11
- Implement `rest-tool upgrade` command to upgrade an existing API project.

## 0.4.10
- Upgrade docs/templates to use jquery-1.11.0.
- Title is a link to the docs/index.html in service documentation pages.
- Fix the missing jquery-min.map bug.
- Fix validationSchema bugs in test templates.
- Cleansing in the templates/project/server/api.js
- Extend the server documentation:
    - Add references
    - Add some hints on dynamic mock service implementations

## 0.4.9
- Implement test/manual_test.sh to run the most fundamental usage scenario.
- Upgrade to rest-tool-common v0.3.8
- Fix service template bugs. Write service.yml related documentation.
- Extend the server documentation:
    - Detailing the server configuration description.
    - Split documentation pages into subsections.
    - Reorganize the documentation file, and add service description to it.

## 0.4.8
- Bugfix: index.html is missing from tesmplate/docs/ folder.
- Extend the getStarted documentation page.
- Extend the documentation page.

## 0.4.1
- Add bulk service generation feature 'rest-tool add-bulk --help'
- Add Add response.description field to the schema and document template
- Upgrade to rest-tool-common v0.3.7

## 0.4.0
- Upgrade to should v3.1.2
- Upgrade to rest-tool-common v0.3.6
- Add service generation feature 'rest-tool add --help'
- Add changelog.md

## 0.3.0
- Create static pages for docs with relative paths, including all service details.

## 0.2.5
- Add .gitignore to the project template. Upgrade to rest-tool-common v0.3.3
- Upgrade to rest-tool-common v0.3.1
- Bugfix the test client templates of relete and put methods. Upgrade to rest-tool-common v0.3.1.
- Add Google Analytics code to the index page.
- Merge branch 'gh-pages' of github.com:tombenke/rest-tool
- Create gh-pages branch via GitHub

## 0.2.4
- Add purpose to the readme file.

## 0.2.3
- Update README.md

## 0.2.2
- Replace restapi to rest-tool in all places where it is relevant. Update the content of the README.md file.

## 0.2.1
- Add placeholder for server templates.

## 0.2.0
- Add templates and modify commands according to the changes in rest-tool-common

## 0.1.1
- First commit

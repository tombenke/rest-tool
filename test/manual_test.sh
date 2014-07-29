#!/bin/bash

declare -rx SCRIPT_DESCRIPTION="Manual testing of the rest-tool utility."
declare -rx SCRIPT_HELP="
You can test either the globally installed 'rest-tool' utility or an other one
from the source tree.

You can define which rest-tool should the script use via the -p parameter.
The default is the rest-tool command installed globaly by the npm.
If you want to test your rest-tool corrently under development, you should define its path with -p.

Note: This utility will create subdirectory under the current working directory.
So move into a temporary directory, from the rest-tool source,
if you do not want to pollute it with the generated files.

To test the rest-tool installed globally execute the following steps:

1. Move to a temporary directory where the generation of test projects will happen.

2. Execute the following command:

   rest-tool-manual_test

3. See the results, which should be something like:

  ✔ 15 tests complete (139ms)

To test the rest-tool from a source tree under development, the step 2. will be:

   <path-to-test-script>/manual_test.sh -p <path-to-rest-tool-command>

for example:

   ~/rest-tool/test/manual_test.sh -p ~/rest-tool/bin/rest-tool.js
"
declare -rx SCRIPT=${0##*/}         # SCRIPT is the name of this script
declare -rx test_project="test-api"
declare -x rest_tool_cmd="rest-tool"
declare -r SCRIPT_PATH=`realpath $0`
declare -r SCRIPT_DIR=`dirname $SCRIPT_PATH`

# Process the parameters
while [ $# -gt 0 ] ; do
    case "$1" in
    -h | --help) # Show help
        printf "%s\n" \
            "Usage: " \
            "$SCRIPT [OPTION]..." \
            "$SCRIPT_DESCRIPTION" \
            "$SCRIPT_HELP" \
            "Options:" \
            "   [-h][--help]                : show this help and exit" \
            "   [-p \"<path-to-rest-tool>\"]   : define the path of the rest-tool command" \
            " " \
        exit 0
        ;;

    -p ) # Define the path to the rest-tool command
        shift
        if [ $# -eq 0 ] ; then
            printf  "$SCRIPT:$LINENO: %s\n" \
                    "command path for -p is missing" >&2
            exit 192
        fi
        rest_tool_cmd="$1"

        # Sanity check
        if test ! -x "$rest_tool_cmd" ; then
           printf "$SCRIPT:$LINENO: the command $rest_tool_cmd is not available — aborting\n " >&2
           exit 192
        fi
        ;;

    -* ) # Unsupported switch
        printf  "$SCRIPT:$LINENO: %s\n" \
                "switch $1 not supported" >&2
        exit 192
        ;;

     * ) # Extra argument of missing switch
        printf "$SCRIPT:$LINENO: %s\n" \
               "extra argument or missing switch: $1" >&2
        exit 192
        ;;
    esac
    shift
done

$rest_tool_cmd -V

# Create the project and move into the project root folder
rm -fr $test_project
$rest_tool_cmd create $test_project
cd $test_project

# Install node module dependencies
npm install

# Create some services and add them to the config.yml
$rest_tool_cmd add \
    -t COLLECTION \
    -p "/users" \
    -u "/users" \
    -n "Users" \
    -d "User collection management"

# sed -i -e '/^services:/a\    - \/users' config.yml

$rest_tool_cmd add \
    -t RESOURCE \
    -p "/users/user" \
    -u "/users/user" \
    -n "User" \
    -d "User management"

# sed -i -e '/^services:/a\    - \/users\/user' config.yml

$rest_tool_cmd add \
    -t OPERATION \
    -p "/filterUsers" \
    -u "/filterUsers" \
    -n "Complex user filtering" \
    -d "Complex filtering of users collection"

# sed -i -e '/^services:/a\    - \/filterUsers' config.yml

# Create some services in bulk mode and add them to the config.yml

# TODO
$rest_tool_cmd add-bulk -s ${SCRIPT_DIR}/services.json

# sed -i -e '/^services:/a\    - \/orders' config.yml
# sed -i -e '/^services:/a\    - \/orders\/order' config.yml
# sed -i -e '/^services:/a\    - \/filterOrders' config.yml

# Update the documentation
rm -fr test/*
$rest_tool_cmd test --update

# Update the test cases
$rest_tool_cmd docs --update

# Start the server
node server/server.js &
declare -rx server_pid=$!

# Wait until server is stable and listening on port
sleep 5

# run the test cases
mocha

# Stop the server
kill -9 $server_pid

# Exit with success
exit 0
#!/bin/bash

declare -rx SCRIPT_DESCRIPTION="Manual testing of the rest-tool utility."
declare -rx SCRIPT=${0##*/}         # SCRIPT is the name of this script
declare -rx test_project="test-api"
declare -x rest_tool_cmd="rest-tool"

# Process the parameters
while [ $# -gt 0 ] ; do
    case "$1" in
    -h | --help) # Show help
        printf "%s\n" \
            "Usage: " \
            "$SCRIPT [OPTION]..." \
            "$SCRIPT_DESCRIPTION" \
            "" \
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
    -p "users" \
    -u "/users" \
    -n "Users" \
    -d "User collection management"

sed -i -e '/^    - \/monitoring\/isAlive/a\    - \/users' config.yml

$rest_tool_cmd add \
    -t RESOURCE \
    -p "users/user" \
    -u "/users/user" \
    -n "User" \
    -d "User management"

sed -i -e '/^    - \/monitoring\/isAlive/a\    - \/users\/user' config.yml

$rest_tool_cmd add \
    -t OPERATION \
    -p "filterUsers" \
    -u "/filterUsers" \
    -n "Complex user filtering" \
    -d "Complex filtering of users collection"

sed -i -e '/^    - \/monitoring\/isAlive/a\    - \/filterUsers' config.yml


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
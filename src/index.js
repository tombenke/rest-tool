#!/usr/bin/env node
/*jshint node: true */
'use strict';

import defaults from './config'
import cli from './cli'
import commands from './commands/'
import npac from 'npac'

const dumpCtx = (ctx, next) => {
    console.log('dumpCtx:', ctx)
    next(null, ctx)
}

export const start = (argv=process.argv, cb=null) => {

    // Use CLI to gain additional parameters, and command to execute
    const { cliConfig, command } = cli.parse(defaults, argv)
    console.log(cliConfig, command)
    // Create the final configuration parameter set
    const config = npac.makeConfig(defaults, cliConfig, 'configFileName')
    console.log(config)

    // Define the adapters and executives to add to the container
    const adapters = [
        dumpCtx,
        npac.mergeConfig(config),
        dumpCtx,
        commands,
        dumpCtx
    ]

    // Define the jobs to execute: hand over the command got by the CLI.
    const jobs = [npac.makeCallSync(command)]

    //Start the container
    console.log(adapters, jobs)
    npac.start(adapters, jobs, cb)
}

#!/usr/bin/env node
/*jshint node: true */
'use strict';

import defaults from './config'
import cli from './cli'
import commands from './commands/'
import app from './index'

const { cliConfig, command } = cli.parse()
const config = app.makeConfig(defaults, cliConfig, 'configFileName')
const adapters = [app.mergeConfig(config), commands]
const jobs = [app.makeCallSync(command)]
app.start(adapters, jobs)

//import npac from './npac'

//const app = npac(defaults, cli, commands)
//app.start()

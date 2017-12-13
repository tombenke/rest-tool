#!/usr/bin/env node
/*jshint node: true */
'use strict';

import defaults from './config'
import cli from './cli'
import commands from './commands/'
import rome from './rome'

const app = rome(defaults, cli, commands)
app.start()

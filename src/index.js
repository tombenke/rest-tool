#!/usr/bin/env node
/*jshint node: true */
'use strict';

import defaults from './config'
import cli from './cli'
import commands from './commands/'
import npac from './npac'

const app = npac(defaults, cli, commands)
app.start()

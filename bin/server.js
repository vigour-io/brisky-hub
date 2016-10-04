#!/usr/bin/env node

'use strict'

const Hub = require('../lib')

const hub = new Hub({
  id: process.argv[2] || 'hub',
  port: process.argv[3] || 3031
})

#!/usr/bin/env node

'use strict'

const Hub = require('../lib')

new Hub({ id: process.argv[2] || 'hub', port: process.argv[3] || 3031 }) // eslint-disable-line

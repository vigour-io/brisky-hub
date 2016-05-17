'use strict'
const test = require('tape')
const Hub = require('../')

test('basic setup', function (t) {
  console.log('start')
  // find free port
  const server = new Hub({ port: 3030 })
  const client = new Hub({ url: 'ws://localhost:3030' })
  t.end()
})

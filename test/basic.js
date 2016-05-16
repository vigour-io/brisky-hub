'use strict'
const test = require('tape')
const Hub = require('../')

test('basic setup', function (t) {
  console.log('start')
  const server = Hub({ listen: 6060 })
  const client = Hub({ connect: 'ws://localhost:6060' })
  console.log(server, client)
  t.end()
})

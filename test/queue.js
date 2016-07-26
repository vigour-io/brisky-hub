'use strict'
const test = require('tape')
const Hub = require('../')

test('queue', function (t) {
  const server = new Hub({
    port: 6000
  })

  const client = new Hub({
    url: 'ws://localhost:6000'
  })

  client.connected.once(() => {
    console.log('connected!')
  })
})

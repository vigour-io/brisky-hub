'use strict'
const test = require('tape')
const Hub = require('../')

test('queue', function (t) {
  const server = new Hub({
    port: 6000,
    field: { title: 'server' }
  })

  server.field.once((val) => {
    console.log('field somethign is happening', val)
  })

  const client1 = new Hub({
    url: 'ws://localhost:6000'
  })

  const client2 = new Hub({
    url: 'ws://localhost:6000',
    field: {}
  })

  client1.set({
    field: {
      title: 'client-1'
    }
  })

  client1.field.remove()

  // allready need timestamp here in order to test this correctly
  console.log(client1.queue)

  client1.connected.once(() => {
    console.log('connected! client1')
  })

  client2.connected.once(() => {
    console.log('connected! client2')
  })
})

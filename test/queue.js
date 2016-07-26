'use strict'
const test = require('tape')
const Hub = require('../')

test('queue', function (t) {
  const server = new Hub({
    port: 6000,
    field: { title: 'server' }
  })

  const client1 = new Hub({
    context: 'blurf',
    id: 1,
    url: 'ws://localhost:6000'
  })

  const client2 = new Hub({
    url: 'ws://localhost:6000',
    context: 'blurf',
    id: 2,
    field: {
      lulz: true
    }
  })

  client1.set({
    field: {
      title: 'client-1'
    }
  })

  client1.set({
    field: {
      title: 'client-1!'
    }
  })

  client2.set({
    field: {
      title: 'client-2!'
    }
  })

  console.log(client1.queue)
  console.log(client2.queue)

  setTimeout(() => {
    console.log(server)
    console.log(server.instances)
  }, 500)

  client1.connected.once(() => {
    console.log('connected! client1')
  })

  client2.connected.once(() => {
    console.log('connected! client2')
  })
})

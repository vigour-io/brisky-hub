'use strict'
const test = require('tape')
const Hub = require('../')

// add client subs as well

test('clients', function (t) {
  t.plan(4)
  const subs = {
    clients: { $any: { val: true } },
    $amy: { val: true }
  }

  const server = new Hub({
    id: 'server',
    clients: { sort: 'key' },
    port: 6000
  })

  const hybrid = new Hub({
    id: 'hybrid',
    context: false,
    url: 'ws://localhost:6000',
    port: 6001
  })

  const client = new Hub({
    id: 'client',
    context: false,
    url: 'ws://localhost:6001',
    x: true
  })

  hybrid.subscribe(subs)

  client.connected.is(true)
    .then(() => t.ok(true, 'client connected to hybrid'))

  hybrid.connected.is(true)
    .then(() => t.ok(true, 'hybrid connected to server'))

  server.get('clients', {}).is(() => server.clients.keys().length > 1)
    .then(() => {
      t.same(server.clients.keys(), [ 'client', 'hybrid' ], 'server got all clients')
      server.get('x', {}).is(true).then(() => {
        t.ok(true, 'server got x from client')
        disconnect()
      })
    })

  function disconnect () {
    // same error! -- need to fix this
    console.log(client.instances)
    client.set({ url: null })
  }
})

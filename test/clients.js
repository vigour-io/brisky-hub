'use strict'
const test = require('tape')
const Hub = require('../')

test('clients', function (t) {
  t.plan(7)
  const subs = {
    clients: {
      $any: {
        val: true,
        upstream: { val: true },
        ip: { val: true }
      }
    },
    $any: { val: true }
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
  client.subscribe(subs)

  client.connected.is(true)
    .then(() => t.ok(true, 'client connected to hybrid'))

  client.client.origin().get('upstream', {}).is('hybrid')
    .then(() => t.ok(true, 'upstream on client is hybrid'))

  client.client.origin().get('ip', {}).is('::ffff:127.0.0.1')
    .then(() => t.ok(true, 'ip on client is localhost'))

  hybrid.connected.is(true)
    .then(() => t.ok(true, 'hybrid connected to server'))

  Promise.all([
    server.get('clients', {}).is(() => server.clients.keys().length > 1),
    client.client.origin().get('upstream', {}),
    client.client.origin().get('ip', {})
  ]).then(() => {
    t.same(server.clients.keys(), [ 'client', 'hybrid' ], 'server got all clients')
    server.get('x', {}).is(true).then(() => {
      t.ok(true, 'server got x from client')
      disconnect()
    })
  })

  function disconnect () {
    client.set({ url: null })
    server.get('clients.client').is(null).then(done)
  }

  function done () {
    t.ok(true, 'client got removed from server')
    server.remove()
    hybrid.remove()
    client.remove()
    t.end()
  }
})

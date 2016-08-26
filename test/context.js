'use strict'
const test = require('tape')
const Hub = require('../')

test('context', function (t) {
  const subs = {
    $any: { val: true },
    clients: { $any: { val: true } }
  }

  const server = new Hub({
    id: 'server',
    port: 6000,
    clients: { sort: 'key' }
  })

  const client = new Hub({
    id: 'client1',
    context: false,
    url: 'ws://localhost:6000',
    clients: { sort: 'key' },
    x: true
  })

  client.subscribe(subs)

  const client2 = new Hub({
    id: 'client2',
    context: false,
    url: 'ws://localhost:6000',
    clients: { sort: 'key' }
  })

  client2.subscribe(subs)

  const client3 = new Hub({
    id: 'client3',
    context: false,
    url: 'ws://localhost:6000',
    clients: { sort: 'key' }
  })

  client3.subscribe(subs)

  const client4 = new Hub({
    id: 'client4',
    context: false,
    url: 'ws://localhost:6000',
    clients: { sort: 'key' }
  })

  client4.subscribe(subs)

  server.get('x', false).is(true).then(() => {
    client.set({ context: 'someuser', hello: true })
    server.on(function context (val, stamp) {
      if (val.context) {
        setTimeout(() => {
          t.equal(this.context.compute(), 'someuser', 'server received context')
          t.equal(server.instances.length, 1, 'server has an extra instance')
          const instance = server.instances[0]
          t.ok(instance.clients !== server.clients, 'created new clients object for instance')
          t.same(instance.clients.keys(), [ 'client1' ], 'instance has client1')
          t.same(client.clients.keys(), [ 'client1' ], 'client1 has correct clients')
          t.same(client2.clients.keys(), [ 'client2', 'client3', 'client4' ], 'client2 has correct clients')
          t.same(client3.clients.keys(), [ 'client2', 'client3', 'client4' ], 'client3 has correct clients')
          t.same(client4.clients.keys(), [ 'client2', 'client3', 'client4' ], 'client4 has correct clients')
          t.same(server.clients.keys(), [ 'client2', 'client3', 'client4' ], 'client1 removed from server clients')
          this.off(context)
          t.ok(!('hello' in client2), 'does not recieve hello in client2')
          client2.set({ context: 'someuser' })
          client2.get('hello', false).is(true).then(() => {
            t.ok('received context on client2 after switching to someuser')
            t.ok(!('hello' in client3), 'does not recieve hello in client3')
            client3.set({ originfield: true })
            Promise.all([
              client2.get('originfield', false).is(true),
              client.get('originfield', false).is(true)
            ]).then(orginUpdate)
          })
        }, 300)
      }
    })

    function orginUpdate () {
      t.ok(true, 'got origin field on context clients')
      client3.set({ hello: 'bye' })
      client4.get('hello', false).is('bye').then(() => {
        t.ok(true, 'client4 recieves update from client3')
        process.nextTick(() => {
          t.equal(client.hello.compute(), true, 'client does not get update for hello')
          t.equal(client2.hello.compute(), true, 'client2 does not get update for hello')
          client3.hello.remove()
          client4.hello.once('remove', (val) => {
            t.ok(true, 'removed client4.hello')
          })
          client.hello.once('remove', (val) => {
            t.ok(true, 'removed client.hello')
          })
        })
      })
    }
  })
})

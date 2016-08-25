'use strict'
const test = require('tape')
const Hub = require('../')
const vstamp = require('vigour-stamp')

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
    x: true
  })

  client.subscribe(subs)

  const client2 = new Hub({
    id: 'client2',
    context: false,
    url: 'ws://localhost:6000'
  })

  client2.subscribe(subs)

  const client3 = new Hub({
    id: 'client3',
    context: false,
    url: 'ws://localhost:6000'
  })

  client3.subscribe(subs)

  const client4 = new Hub({
    id: 'client4',
    context: false,
    url: 'ws://localhost:6000'
  })

  client4.subscribe(subs)

  server.get('x', false).is(true).then(() => {
    client.set({ context: 'someuser', hello: true })
    server.on(function context (val, stamp) {
      if (val.context) {
        t.equal(this.context.compute(), 'someuser', 'server received context')
        t.equal(server.instances.length, 1, 'server has an extra instance')
        const instance = server.instances[0]
        t.ok(instance.clients !== server.clients, 'created new clients object for instance')
        t.same(instance.clients.keys(), [ 'client1' ], 'instance has client1')
        t.same(server.clients.keys(), [ 'client2', 'client3', 'client4' ], 'client1 removed from server clients')
        vstamp.done(stamp, () => this.off(context))
        t.ok(!('hello' in client2), 'does not recieve hello in client2')
        client2.set({ context: 'someuser' })
        client2.get('hello', false).is(true).then(() => {
          t.ok('received context on client2 after switching to someuser')
          t.ok(!('hello' in client3), 'does not recieve hello in client3')
          client3.set({ originfield: true })
          Promise.all([
            client2.get('originfield', false).is(true),
            client.get('originfield', false).is(true)
          ]).then(() => {
            t.ok(true, 'got orgiin field on context clients')
          })
          // then somefield should not be recived by anything else when setting hello
        })
        // t.end()
      }
    })

    // need to receive these 2 clients as well

    // client2.clients.on(function (val, stamp) {
    //   vstamp.done(stamp, () => {
    //     // console.log('client2 --->', this.keys())
    //   })
    // })
    // client.clients.on(function (val, stamp) {
    //   vstamp.done(stamp, () => {
    //     // console.log('client1 --->', this.keys())
    //   })
    // })
  })
})

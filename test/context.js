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
    port: 6000
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

  server.get('x', false).is(true).then(() => {
    console.log(' \ngot "x: true" lets change context')
    // what do we do when you change context?
    // clear current context prob?
    client.set({
      context: 'someuser',
      hello: true
    })

    server.on(function context (val, stamp) {
      if (val.context) {
        t.equal(this.context.compute(), 'someuser', 'server received context')
        t.equal(server.instances.length, 1, 'server has an extra instance')
        const instance = server.instances[0]
        t.ok(instance.clients !== server.clients, 'created new clients object for instance')
        t.same(instance.clients.keys(), [ 'client1' ], 'instance has client1')
        t.same(instance.clients.keys(), [ 'client2' ], 'server only has client2')
        vstamp.done(stamp, () => this.off(context))
        // t.end()
      }
    })

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

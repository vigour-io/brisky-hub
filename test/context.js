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
    console.log('got "x: true" lets change context')

    // what do we do when you change context?
    // clear current context prob?

    client.set({
      context: 'someuser',
      hello: true
    })

    // console.log(server.clients)

    console.log(server.clients.keys())

    setTimeout(() => {
      console.log(server.clients.keys())
      console.log(server.instances[0].clients.keys())
      console.log(client2.clients.keys())
      console.log(client.clients.keys())
    }, 2e3)

    client2.clients.on(function (val, stamp) {
      vstamp.done(stamp, () => {
        console.log('client2 --->', this.keys())
      })
    })

    client.clients.on(function (val, stamp) {
      vstamp.done(stamp, () => {
        console.log('client1 --->', this.keys())
      })
    })

    t.end()
  })

  // t.end()
})

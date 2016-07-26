'use strict'
const test = require('tape')
const Hub = require('../')
// const vstamp = require('vigour-stamp')

test('queue', function (t) {
  const server = new Hub({
    port: 6000
  })

  const client1 = new Hub({
    url: 'ws://localhost:6000',
    context: 'blurf',
    id: 1
  })

  client1.subscribe({ $any: { val: true } })

  const client2 = new Hub({
    url: 'ws://localhost:6000',
    context: 'blurf',
    id: 2
  })

  client2.subscribe({ $any: { val: true } })

  client1.set({ a: 1, b: 1, c: 1 })
  client2.set({ a: 2, b: 2, c: 2 })

  isConnected(true, () => {
    const context = server.getContext('blurf')
    t.equal(context.a.val, 2, '"a" is set by "client2"')
    t.equal(context.b.val, 2, '"b" is set by "client2"')
    t.equal(context.c.val, 2, '"c" is set by "client2"')
    server.port.set(false)
    isConnected(false, disconnect)
  })

  function disconnect () {
    t.ok(true, 'disconnected clients')
    client1.a.set(-1)
    client1.b.set(-1)
    setTimeout(() => {
      client2.a.set(-2)
      client2.b.set(-2)
      setTimeout(() => {
        client1.a.set('a')
        client1.c.remove()
        server.port.set(6000)
        isConnected(true, reconnect)
      }, 1)
    }, 1)
  }

  function reconnect () {
    t.ok(true, 'reconnected clients')
    const context = server.getContext('blurf')
    t.equal(context.a.val, 'a', 'server - "a" is set to client1')
    t.equal(context.b.val, -2, 'server - "b" is set to client2')
    t.equal(context.c, null, 'server - "c" is removed')

    t.equal(client1.a.val, 'a', 'client1 - got "a" from client1')
    t.equal(client1.b.val, -2, 'client1 - got "b" from client2')
    t.equal(client1.c, null, 'client1 - "c" is removed')

    t.equal(client2.a.val, 'a', 'client2 - got "a" from client1')
    t.equal(client2.b.val, -2, 'client2 - got "b" from client2')
    t.equal(client2.c, null, 'client2 - "c" is removed')

    server.remove()
    client1.remove()
    client2.remove()
    t.end()
  }

  function isConnected (val, cb) {
    function error (err) { throw err }
    Promise.all([
      client1.connected.is(val),
      client2.connected.is(val)
    ]).then(() => {
      setTimeout(cb, 25)
    }).catch(error)
  }
})

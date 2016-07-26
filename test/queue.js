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

  const client2 = new Hub({
    url: 'ws://localhost:6000',
    context: 'blurf',
    id: 2
  })

  client1.set({ a: 1, b: 1 })
  client2.set({ a: 2, b: 2 })

  server.get('a', {}).on(function (val, stamp) {
    console.log('incoming', val, stamp, this.parent.context)
  })

  isConnected(true, () => {
    const context = server.getContext('blurf')
    t.equal(context.a.val, 2, '"a" is set by "client2"')
    t.equal(context.b.val, 2, '"b" is set by "client2"')
    server.port.set(false)
    isConnected(false, disconnect)
  })

  function disconnect () {
    t.ok(true, 'disconnected clients')
    server.port.set(6000)
    isConnected(true, reconnect)
  }

  function reconnect () {
    t.ok(true, 'reconnected clients')
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
      setTimeout(cb, 10)
    }).catch(error)
  }
})

'use strict'
const test = require('tape')
const Hub = require('../')
// const vstamp = require('vigour-stamp')

test('clients', function (t) {
  const subs = {
    clients: { $any: { val: true } }
  }

  const server = new Hub({
    id: 'server',
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

  // client.subscribe(subs)
  // has to be auto soon -- also unsubscribe
  hybrid.subscribe(subs)

  server.get('x', {}).is(true).then(() => {
    console.log('server :)')
  })

  hybrid.get('x', {}).is(true).then(() => {
    console.log('hybrid :)')
  })

  Promise.all([
    client.connected.is(true),
    hybrid.connected.is(true),
    server.get('clients', {}).is(
      (val, data, stamp, clients) => {
        console.log(stamp)
        return clients.keys().length > 1
      }
    )
  ]).then(() => {
    console.log('got all clients! :D')
    console.log(server.clients.keys())
    // console.log(server.clients.client)
    // console.log('x', server.clients)
  })

  t.end()
})

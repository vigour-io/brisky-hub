'use strict'

const test = require('tape')
const Hub = require('../')

test('connections', (t) => {
  const server = new Hub({
    // id: 'server', // @NOTE: uncomment for tets to pass
    port: 6001
  })
  const client = new Hub({
    // id: 'client', // @NOTE: uncomment for tets to pass
    url: 'ws://localhost:6001'
  })
  client.subscribe({ val: true })

  setTimeout(() => {
    t.ok(client.get('connected.compute'), 'app is connected')
    server.set({
      changed: true
    })
    setTimeout(() => {
      t.ok(client.get('connected.compute'), 'client is still connected')
      t.equals(client.get('changed.compute'), true, 'client got update from set on server')
      client.remove()
      server.remove()
      t.end()
    }, 100)
  }, 100)
})

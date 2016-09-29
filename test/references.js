'use strict'

const test = require('tape')
const Hub = require('../')

test('serialize', function (t) {
  const server = new Hub({
    id: 'server',
    context: false,
    syncUp: false,
    port: 6000,
    clients: { sort: 'key' },
    obj1: {},
    obj2: {
      bla: {
        x: true,
        y: '$root.obj1'
      }
    }
  })
  server.set({
    obj1: { ref: server.obj2 },
    obj2: { ref: server.obj1 }
  })

  const client = new Hub({
    id: 1,
    url: 'ws://localhost:6000',
    context: false
  })

  client.subscribe({ val: true })

  setTimeout(() => {
    t.pass('did not crash on circular references')
    client.remove()
    server.remove()
    t.end()
  }, 100)
})

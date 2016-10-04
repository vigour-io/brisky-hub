'use strict'
const test = require('tape')
const Hub = require('../')
// const vstamp = require('vigour-stamp')

test('tree - exec function gaurds', (t) => {
  const server = new Hub({
    id: 'server',
    port: 6000,
    a: 'hello a'
  })

  const subs = {
    a: { val: true }
  }

  const client = new Hub({
    id: 1,
    context: false,
    url: 'ws://localhost:6000'
  })

  client.subscribe(subs)

  const client1 = new Hub({
    id: 2,
    context: false,
    url: 'ws://localhost:6000'
  })

  client1.subscribe(subs)

  setTimeout(() => {
    client1.remove()
    client.clients.is(() => client.clients.keys().length === 1).then(() => {
      client.remove()
    })
  }, 100)
})

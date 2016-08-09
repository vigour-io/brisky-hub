'use strict'
const test = require('tape')
const Hub = require('../')

test('context', function (t) {
  const subs = {
    $any: { val: true }
  }

  const server = new Hub({
    id: 'server',
    port: 6000
  })

  const client = new Hub({
    id: 'client',
    context: false,
    url: 'ws://localhost:6000',
    x: true
  })

  server.get('x', false).is(true).then(() => {
    console.log('got "x: true" lets change context')
    client.set({
      context: 'someuser',
      hello: true
    })
  })

  // t.end()
})

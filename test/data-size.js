'use strict'

const test = require('tape')
const Hub = require('../')

test('data size', { timeout: 500 }, t => {
  const server = new Hub({
    id: 'server',
    port: 6000
  })

  const client = new Hub({
    id: 'client',
    url: 'ws://localhost:6000',
    context: false
  })

  var someData = {}
  // make it 6 thousand and it works
  let i = 7e3
  while (i-- > 0) {
    const d = 1e9 + Math.round(Math.random() * 1e9)
    someData[`key-${d}-longer-string-${d}`] = { subKey: `val-${d}-longer-string-${d}` }
  }

  console.log(JSON.stringify(someData).length)
  server.set({ someData })

  client.subscribe({ someData: { val: true } }, () => {
    t.ok(true, 'subscription fired')
    t.end()
    server.set(null)
    client.set(null)
  })
})

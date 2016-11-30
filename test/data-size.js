'use strict'

const test = require('tape')
const Hub = require('../')

var server, client

test('data size', { timeout: 2000 }, t => {
  server = new Hub({
    id: 'server',
    port: 6000
  })

  client = new Hub({
    id: 'client',
    url: 'ws://localhost:6000',
    context: false
  })

  var someData = {}
  const val = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'
  let i = 1e3
  while (i-- > 0) {
    const d = 1e11 + Math.round(Math.random() * 1e11)
    someData[`key-${d}-longer-string-${d}`] = {
      keyOne: { subKeyOne: val, subKeyTwo: val, subKeyThree: val },
      keyTwo: { subKeyOne: val, subKeyTwo: val, subKeyThree: val },
      keyThree: { subKeyOne: val, subKeyTwo: val, subKeyThree: val },
      keyFour: { subKeyOne: val, subKeyTwo: val, subKeyThree: val },
      keyFive: { subKeyOne: val, subKeyTwo: val, subKeyThree: val }
    }
  }

  server.set({ someData })

  client.subscribe({ someData: { val: true } }, () => {
    t.ok(true, 'subscription fired')
    client.off('subscription', 'subId')
    t.end()
  }, null, null, null, 'subId')
})

test('reset', t => {
  client.set(null)
  server.set(null)
  t.end()
})

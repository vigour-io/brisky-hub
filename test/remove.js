'use strict'

const test = require('tape')
const Hub = require('../')

test('remove a server that has no clients', (t) => {
  const server = new Hub({
    id: 'scraper',
    port: 6002
  })
  try {
    server.remove()
    t.pass('removed')
  } catch (err) {
    t.fail('crashed on remove')
    console.log(err.stack)
    server.downstream.close()
  }
  t.end()
})

'use strict'
const test = require('tape')
const Hub = require('../')

test('context', function (t) {
  // const subs = {
  //   clients: {
  //     $any: {
  //       val: true,
  //       upstream: { val: true },
  //       ip: { val: true }
  //     }
  //   },
  //   $any: { val: true }
  // }

  // const server = new Hub({
  //   id: 'server',
  //   clients: { sort: 'key' },
  //   port: 6000
  // })

  const client = new Hub({ // eslint-disable-line
    id: 'client',
    context: false,
    url: 'ws://localhost:6001',
    x: true
  })

  client.remove()
  t.end()
})

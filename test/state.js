'use strict'
const test = require('tape')
const Hub = require('../')

test('hub client and server listeners', function (t) {
  const server = new Hub({
    id: 'server',
    field: {
      val: 1,
      on: {
        data (data, stamp) {
          console.llg('fire flame')
          if (this.compute() === 2) {
            t.pass('server is updated')
            this.set(3, stamp)
          }
        }
      }
    },
    port: 6000
  })

  const client = new Hub({
    id: 1,
    context: false,
    url: 'ws://localhost:6000'
  })

  client.subscribe({
    field: { val: true }
  })

  client.get('field', {}).is(1, (data, stamp) => {
    client.field.set(2, stamp)
  })

  client.get('field', {}).is(3, () => {
    t.pass('client is updated')
    t.end()
    client.remove()
    server.remove()
  })
})

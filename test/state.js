'use strict'
const test = require('tape')
const Hub = require('../')

test('hub client and server listeners', function (t) {
  const server = new Hub({
    id: 'server',
    field: {
      val: 1,
      on: {
        data () {
          if (this.compute() === 2) {
            t.equals(this.compute(), 2, 'server is updated')
            t.end()
            client.remove()
            server.remove()
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
    field: {
      val: true
    }
  })

  client.get('field', {}).is(1, () => {
    client.field.set(2)
  })
})

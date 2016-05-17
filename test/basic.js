'use strict'
const test = require('tape')
const Hub = require('../')

test('basic setup', function (t) {
  console.log('start')
  // find free port
  const server = new Hub({ port: 3030 }) //eslint-disable-line
  const client = new Hub({ url: 'ws://localhost:3030' })
  client.set({
    on: {
      data: {
        upstream: null // so this does not work...
      }
    }
  })
  client.subscribe({
    $any: { val: true }
  }, (state, type) => {
    console.log('yo!', type, state.path())
  })

  console.log('set blurf')
  client.set({ blurf: true })
  t.end()
})

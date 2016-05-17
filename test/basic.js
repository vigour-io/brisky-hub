'use strict'
const test = require('tape')
const Hub = require('../')

test('basic setup', function (t) {
  console.log('start')
  // find free port
  const server = new Hub({ port: 3030 }) //eslint-disable-line
  // const server2 = new Hub({ port: 3031 }) //eslint-disable-line -- for switching it
  const client = new Hub({
    id: 'client-1',
    url: 'ws://localhost:3030'
  })

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

  setTimeout(function () {
    client.url.set('ws://localhost:3031')
    // client.remove()
  }, 500)

  setTimeout(function () {
    // client.remove()
    // server.port.set(3031)
    server.remove()
    setTimeout(() => {
      console.log('-----')
      client.url.remove()
    }, 1000)
  }, 1000)
  t.end()
})

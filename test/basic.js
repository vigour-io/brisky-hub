'use strict'
const test = require('tape')
const freeport = require('freeport')
const Hub = require('../')

// make an easy test setup for this
test('basic setup', function (t) {
  console.log('start')
  // find free port
  freeport(function (err, port) {
    if (err) { throw err }
    console.log('PORT', port)
    const server = new Hub({ port: port }) //eslint-disable-line
    // const server2 = new Hub({ port: 3031 }) //eslint-disable-line -- for switching it
    const client = new Hub({
      id: 'client-1',
      url: 'ws://localhost:' + port
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
    freeport(function (err, port2) {
      if (err) { throw err }
      setTimeout(function () {
        console.log(' -----')
        console.log(' change client url')
        client.url.set('ws://localhost:' + port2)
      }, 300)
      setTimeout(function () {
        console.log(' -----')
        console.log(' change server port')
        server.port.set(port2)
        // server.remove()
        setTimeout(() => {
          console.log(' -----')
          console.log(' remove client url')
          client.url.remove()
          setTimeout(() => {
            console.log(' -----')
            console.log(' REMOVE SERVER')
            server.remove()
          }, 300)
        }, 500)
      }, 500)
    })
    t.end()
  })
})

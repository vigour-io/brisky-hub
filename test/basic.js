'use strict'
const test = require('tape')
const Hub = require('../')

test('basic setup', function (t) {
  console.log('start')
  const server = Hub({ listen: 6060 })
  const client = Hub({ connect: 'ws://localhost:6060' })
  // const client2 = Hub({ connect: 'ws://localhost:6060' })
  client.subscribe({
    movies: {
      $any: { title: { val: true } }
    }
  }, (state, type) => {
    console.log('client RECEIVE DATA', type, state.path())
  })
  client.connected.once(() => {
    console.log('lullz connected')
    server.set({
      movies: {
        blargh: {
          title: 'the blargh'
        }
      }
    })
  })
  t.end()
})

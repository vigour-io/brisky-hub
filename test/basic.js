'use strict'
const test = require('tape')
const Hub = require('../')

test('basic setup', function (t) {
  console.log('start')
  const server = Hub({ listen: 6060 }) //eslint-disable-line
  const client = Hub({ connect: 'ws://localhost:6060' })
  const client2 = Hub({ connect: 'ws://localhost:6060' })

  client.subscribe({
    movies: {
      $any: { title: { val: true } }
    }
  }, (state, type) => {
    console.log('client RECEIVE DATA', type, state.path())
  })

  client2.subscribe({
    movies: {
      $any: { title: { val: true } }
    }
  }, (state, type) => {
    console.log('client2 RECEIVE DATA', type, state.path())
  })

  client.set({
    movies: {
      blargh: {
        title: 'the blargh'
      }
    }
  })

  client.connected.once(() => {
    console.log('lullz client 1 connected')
  })
  client2.connected.once(() => {
    console.log('lullz client 2 connected')
  })
  t.end()
})

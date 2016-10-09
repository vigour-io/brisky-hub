'use strict'
const test = require('tape')
const Hub = require('../')

test('client - subscription', (t) => {
  const server = new Hub({
    port: 6000,
    id: 'server',
    content: { title: 'hello' },
    nothing: { title: 'bye' }
  })

  const client = new Hub({
    context: false,
    id: 'client',
    url: 'ws://localhost:6000'
  })

  const client2 = new Hub({
    context: false,
    id: 'client2',
    url: 'ws://localhost:6000'
  })

  const subs = {
    receiver: {
      $switch: {
        exec (state) {
          if (state) {
            console.log(state.root.client.origin(), state.root.id)
            return state.root.client.origin() === state.origin() ? 'receiver' : 'sender'
          }
        },
        sender: {
          $root: {
            nothing: {
              title: {
                val: true
              }
            }
          }
        },
        receiver: {
          $root: {
            content: {
              title: {
                val: true
              }
            }
          }
        }
      }
    }
  }

  client.subscribe(subs, (state) => {
    console.log('yo', state)
  })
  client2.subscribe(subs, (state) => {
    console.log('2 - yo', state)
  })

  client.set({
    // receiver: '$root.x'
    receiver: client.client.origin()
  })

  // also do in test
})

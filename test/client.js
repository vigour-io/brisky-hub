'use strict'
const test = require('tape')
const Hub = require('../')

test('client - subscription', (t) => {
  const server = new Hub({
    port: 6000,
    id: 'server',
    content: { title: 'content' },
    nothing: { title: 'nothing' },
    x: { title: 'x' }
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
          if (state && state.root.client) {
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
    t.same(state.path(), [ 'content', 'title' ])
  })

  client2.subscribe(subs, (state) => {
    t.same(state.path(), [ 'nothing', 'title' ])
  })

  client.set({ receiver: client.client.origin() })
})

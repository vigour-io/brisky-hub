'use strict'
const test = require('tape')
const Hub = require('../')

test('sync', function (t) {
  const subs = {
    something: {
      $any: { val: true }
    }
  }

  const server = new Hub({
    id: 'server',
    context: false,
    port: 6000,
    clients: { sort: 'key' },
    something: {
      sync (state) {
        return state && state.keys().length > 10
      }
    }
  })

  console.log(server.something.syncDownIsFn)

  const client1 = new Hub({
    id: 1,
    url: 'ws://localhost:6000',
    context: 'blurf'
  })

  client1.subscribe(subs)

  const client2 = new Hub({
    id: 2,
    url: 'ws://localhost:6000',
    context: 'blurf'
  })

  client2.subscribe(subs)

  client2.get('something', {}).on('data', (val, stamp) => {
    console.log('incoming!:', val, stamp)
  })

  client1.set({ something: [ 1, 2, 3, 4, 5 ] })

  console.log('gaurd')
  client1.set({ something: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] })
})

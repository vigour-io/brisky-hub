'use strict'
const test = require('tape')
const Hub = require('../')
const vstamp = require('vigour-stamp')

test('sync', function (t) {
  // @NOTE: changed subs to val: true
  const subs = { val: true }
  // const subs = {
  //   something: {
  //     $any: { val: true }
  //   }
  // }

  const server = new Hub({
    id: 'server',
    context: false,
    port: 6000,
    clients: { sort: 'key' },
    something: {
      sync (state) {
        return state && state.keys().length > 10
      }
    },
    somethingElse: {
      sync: false
    }
  })

  const client1 = new Hub({
    id: 1,
    url: 'ws://localhost:6000',
    context: false
  })

  client1.subscribe(subs)

  const client2 = new Hub({
    syncUp: false,
    id: 2,
    url: 'ws://localhost:6000',
    context: false
  })

  client2.subscribe(subs)

  var cnt = 0

  client2.get('something', {}).on('data', (val, stamp) => {
    cnt++
  })

  client1.set({ something: [ 1, 2, 3, 4, 5 ], somethingElse: 'someValue' })

  client2.set({ bla: true })

  server.get('something.1', {})
    .once(() => client1.set({ something: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] }))

  client2.get('something.10', {}).once((val, stamp) => {
    vstamp.done(stamp, () => {
      t.equal(cnt, 1, 'something fired once')
      setTimeout(() => {
        t.ok(!server.bla, 'client2 does not syncUp')
        t.notEqual(
          client2.get('somethingElse.compute'),
          'someValue',
          'did not sync somethingElse'
        )
        server.remove()
        client1.remove()
        client2.remove()
        t.end()
      }, 100)
    })
  })
})

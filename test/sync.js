'use strict'
const test = require('tape')
const Hub = require('../')
const vstamp = require('vigour-stamp')

test('sync', function (t) {
  const subs = { val: true }

  const server = new Hub({
    id: 'server',
    context: false,
    syncUp: false,
    user: { token: { sync: false } },
    port: 6000,
    clients: { sort: 'key' },
    something: {
      sync (state) {
        return state && state.keys().length > 10
      }
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

  client1.set({
    user: {
      token: 'hello'
    }
  })

  client2.subscribe(subs)

  var cnt = 0

  client2.get('something', {}).on('data', (val, stamp) => {
    cnt++
  })

  client1.set({ something: [ 1, 2, 3, 4, 5 ] })

  client2.set({ bla: true })

  server.user.token.is('hello').then(() => {
    t.ok(true, 'received "user.token" on the server')
  })

  server.get('something.1', {})
    .once(() => client1.set({ something: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ] }))

  client2.get('something.10', {}).once((val, stamp) => {
    vstamp.done(stamp, () => {
      t.equal(cnt, 1, 'something fired once')
      setTimeout(() => {
        t.ok(!client2.user.token, 'client2 did not recieve token')
        t.ok(!server.bla, 'client2 does not syncUp')
        server.remove()
        client1.remove()
        client2.remove()
        t.end()
      }, 100)
    })
  })
})

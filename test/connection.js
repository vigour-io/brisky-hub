'use strict'
const test = require('tape')
const freeport = require('freeport')
const vstamp = require('vigour-stamp')
const Hub = require('../')

test('connection', function (t) {
  freeport((err, port) => {
    if (err) { throw err }
    connection(t, port)
  })
})

function connection (t, port) {
  t.plan(4)
  var clientUpdates = []
  var serverUpdates = []
  const seed = vstamp.cnt
  const server = new Hub({
    id: 'server',
    port: port
  })
  const client = new Hub({
    id: 'client-1',
    url: 'ws://localhost:' + port
  })

  client.subscribe(
    {
      $any: { val: true },
      clients: { $any: { val: true } }
    },
    (state, type, stamp) => {
      stamp = vstamp.parse(stamp)
      clientUpdates.push({
        path: state.path().join('.'),
        type: type,
        stamp: vstamp.create(
          stamp.type,
          stamp.src,
          stamp.val - seed
        ),
        val: state.compute()
      })
      // console.log('client times', clientUpdates[clientUpdates.length - 1])
    }
  )

  server.subscribe(
    {
      $any: { val: true },
      clients: { $any: { val: true } }
    },
    (state, type, stamp) => {
      serverUpdates.push({
        path: state.path().join('.'),
        type: type,
        stamp: stamp,
        val: state.compute()
      })
      console.log('server times', serverUpdates[serverUpdates.length - 1])
    }
  )

  t.same(serverUpdates, [
    {
      path: 'connected',
      type: 'new',
      stamp: 1,
      val: false
    }
  ], 'server.connected fired (false)')
  serverUpdates = []

  t.same(clientUpdates, [
    {
      path: 'url',
      type: 'new',
      stamp: 2,
      val: 'ws://localhost:' + port
    },
    {
      path: 'connected',
      type: 'new',
      stamp: 2,
      val: false
    }
  ], 'client.connected fired (false)')
  clientUpdates = []

  client.set({
    d: true
  }, false)

  client.set({
    field: {
      val: true,
      a: {
        b: {
          c: 'hello'
        },
        d: client.d
      }
    }
  })

  client.set({ field: false })

  t.same(clientUpdates, [
    {
      path: 'd',
      type: 'new',
      stamp: vstamp.create(false, client.id, 3),
      val: true
    },
    {
      path: 'field',
      type: 'new',
      stamp: vstamp.create(false, client.id, 3),
      val: true
    },
    {
      path: 'field',
      type: 'update',
      stamp: vstamp.create(false, client.id, 4),
      val: false
    }
  ], 'client.field fired (true)')
  clientUpdates = []

  client.connected.once(() => {
    process.nextTick(() => {
      t.same(clientUpdates, [
        {
          path: 'connected',
          type: 'update',
          stamp: vstamp.create('connect', false, 5),
          val: true
        }
      ], 'client.connected fired (true)')
      clientUpdates = []

      client.set({
        field: {
          a: {
            b: {
              c: 'blargh'
            },
            d: null
          }
        }
      })
      // changeClientPort()
    })
  })

  server.on((val, stamp) => {
    // console.log('yo incoming in dat server', stamp)
    // t.same(serverUpdates, [
    //   {
    //     path: 'field',
    //     type: 'new',
    //     stamp: vstamp.create(false, client.id, 3),
    //     val: true
    //   }
    // ], 'server.field fired (true)')
    // serverUpdates = []
  })

  remove()

  // function changeClientPort () {
  //   freeport((err, port2) => {
  //     if (err) { throw err }
  //     setTimeout(() => {
  //       client.url.set('ws://localhost:' + port2)
  //       changeServerPort(port2)
  //     }, 300)
  //   })
  // }

  // function changeServerPort (port2) {
  //   // set server here
  //   server.set({ field: 'hello' })
  //   setTimeout(() => {
  //     server.port.set(port2)
  //     remove()
  //   }, 300)
  // }

  function remove () {
    setTimeout(() => {
      client.remove()
      removeServer()
    }, 300)
  }

  function removeServer () {
    setTimeout(() => {
      server.remove()
      t.end()
    }, 300)
  }
}

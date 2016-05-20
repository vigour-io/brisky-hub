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
    { $any: { val: true } },
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
    { $any: { val: true } },
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

  t.same(clientUpdates, [
    {
      path: 'connected',
      type: 'new',
      stamp: 2,
      val: false
    }
  ], 'client.connected fired (false)')
  clientUpdates = []

  client.set({ field: true })
  t.same(clientUpdates, [
    {
      path: 'field',
      type: 'new',
      stamp: vstamp.create(false, client.id, 3),
      val: true
    }
  ], 'client.field fired (true)')
  clientUpdates = []

  client.connected.once(() => {
    process.nextTick(() => {
      t.same(clientUpdates, [
        {
          path: 'connected',
          type: 'update',
          stamp: vstamp.create('connect', false, 4),
          val: true
        }
      ], 'client.connected fired (true)')

      console.log('got 4 tests!')
      server.remove()
      client.remove()
      console.log('remove should kill everything')
      // want to get update from server make that now -- has to include the src ofcourse
      // changeClientPort()
    })
  })
}

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
  //     removeClient()
  //   }, 300)
  // }

  // function removeClient () {
  //   setTimeout(() => {
  //     client.url.remove()
  //     removeServer()
  //   }, 300)
  // }

  // function removeServer () {
  //   setTimeout(() => {
  //     server.remove()
  //     t.end()
  //   }, 300)
  // }
// }

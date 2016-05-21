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
    url: 'ws://localhost:' + port,
    client: {
      infos: 'its a client!'
    }
  })

  console.log(client.client.origin())

  client.subscribe(
    {
      $any: { val: true }
    },
    (state, type, stamp) => {
      stamp = state._lstamp !== 0 ? vstamp.parse(state._lstamp) : false
      clientUpdates.push({
        path: state.path().join('.'),
        type: type,
        stamp: stamp && vstamp.create(stamp.type, stamp.src, stamp.val - seed)
      })
      console.log('🔸 ', clientUpdates[clientUpdates.length - 1].path, type)
    }
  )

  // does not work on context unfortunately
  // server.subscribe(
  //   {
  //     $any: { val: 1 },
  //     clients: { $any: { val: true } }
  //   },
  //   (state, type, stamp) => {
  //     stamp = vstamp.parse(stamp)
  //     serverUpdates.push({
  //       path: state.path().join('.'),
  //       type: type,
  //       stamp: vstamp.create(stamp.type, stamp.src, stamp.val - seed),
  //       val: state.compute()
  //     })
  //     console.log('🔹 ', serverUpdates[serverUpdates.length - 1].path, type)
  //   }
  // )

  t.same(clientUpdates, [
    {
      path: 'url',
      type: 'new',
      stamp: 2
    },
    {
      path: 'connected',
      type: 'new',
      stamp: 2
    },
    {
      path: 'clients',
      type: 'new',
      stamp: vstamp.create(false, client.id, 2)
    },
    {
      path: 'client',
      type: 'new',
      stamp: vstamp.create(false, client.id, 2)
    }
  ], 'intial client subscription')
  clientUpdates = []

  client.set({
    d: true
  }, false) // false will not create a stamp

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
      stamp: false
    },
    {
      path: 'field',
      type: 'new',
      stamp: vstamp.create(false, client.id, 3)
    },
    {
      path: 'field',
      type: 'update',
      stamp: vstamp.create(false, client.id, 4)
    }
  ], 'client.field (deep)')
  clientUpdates = []

  // get /w false lets do that by default!

  // server.get('clients', {}).once((val, stamp) => {
  //   // server.clients['client-1'].once((val) => {
  //   //   t.same(val, { infos: 'its a client!' }, 'synced client info to server')
  //   // })
  // })

  client.connected.once(() => {
    process.nextTick(() => {
      setTimeout(() => {
        console.log('????', server._i)
      }, 50)

      t.same(clientUpdates, [
        {
          path: 'connected',
          type: 'update',
          stamp: vstamp.create('connect', false, 5)
        }
      ], 'client.connected (true)')
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
      console.log(' REMOVE CLIENT')
      client.remove()
      removeServer()
    }, 300)
  }

  function removeServer () {
    setTimeout(() => {
      console.log(' REMOVE SERVER')
      server.remove()
      t.end()
    }, 300)
  }
}

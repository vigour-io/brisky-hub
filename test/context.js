'use strict'
const test = require('tape')
const Hub = require('../')

test('context', function (t) {
  const subs = {
    $any: { val: true },
    clients: { $any: { val: true } }
  }

  const server = new Hub({
    id: 'server',
    port: 6000,
    clients: { sort: 'key' }
  })

  const clients = []

  for (let i = 0; i < 6; i++) {
    clients.push(new Hub({
      id: 'client' + i,
      context: false,
      url: 'ws://localhost:6000',
      clients: { sort: 'key' }
    }))
    clients[i].subscribe(subs)
  }

  clients[0].set({ x: true })

  server.get('x', false).is(true).then(() => {
    // may need context as well for each client else it just weird
    clients[0].set({ context: 'someuser', hello: true })
    server.on(function context (val, stamp) {
      if (val.context) {
        setTimeout(() => {
          t.equal(this.context.compute(), 'someuser', 'server received context')
          t.equal(server.instances.length, 1, 'server has an extra instance')
          const instance = server.instances[0]
          const originClients = [ 'client1', 'client2', 'client3', 'client4', 'client5' ]
          t.ok(instance.clients !== server.clients, 'created new clients object for instance')
          t.same(instance.clients.keys(), [ 'client0' ], 'instance has client0')
          t.same(clients[0].clients.keys(), [ 'client0' ], 'client0 has correct clients')
          t.same(clients[1].clients.keys(), originClients, 'client1 has correct clients')
          t.same(clients[2].clients.keys(), originClients, 'client2 has correct clients')
          t.same(clients[3].clients.keys(), originClients, 'client3 has correct clients')
          t.same(server.clients.keys(), originClients, 'client0 removed from server clients')
          this.off(context)
          t.ok(!('hello' in clients[1]), 'does not recieve hello in client1')
          clients[1].set({ context: 'someuser' })
          clients[1].get('hello', false).is(true).then(() => {
            t.ok('received context on client1 after switching to someuser')
            t.ok(!('hello' in clients[2]), 'does not recieve hello in client2')
            clients[2].set({ originfield: true })
            Promise.all([
              clients[1].get('originfield', false).is(true),
              clients[0].get('originfield', false).is(true)
            ]).then(orginUpdate)
          })
        }, 100)
      }
    })

    function orginUpdate () {
      t.ok(true, 'got origin field on context clients')
      clients[2].set({ hello: 'bye' })
      clients[3].get('hello', false).is('bye').then(() => {
        t.ok(true, 'client3 recieves update from client2')
        process.nextTick(() => {
          t.equal(clients[0].hello.compute(), true, 'client1 does not get update for hello')
          t.equal(clients[1].hello.compute(), true, 'client1 does not get update for hello')
          clients[2].hello.remove()
          clients[3].hello.is(null).then((val) => {
            t.ok(true, 'removed client3.hello')
            switchContext()
          })
          // need to fix this with remove instance branch of base
          // client.hello.is(null).then((val) => {
          //   t.ok(true, 'removed client.hello')
          // })
          // client1.hello.is(null).then((val) => {
          //   t.ok(true, 'removed client1.hello')
          // })
        })
      })
    }

    function switchContext () {
      clients[0].set({ context: 'somethingelse' })
      clients[3].set({ context: 'somethingelse' })
      server.on(function context (val, stamp) {
        if (val.context) {
          setTimeout(() => {
            t.equal(server.instances.length, 2, 'server has an extra instance')
            const someuser = server.instances[0]
            const somethingelse = server.instances[1]
            t.same(someuser.clients.keys(), [ 'client1' ], 'someuser has client1')
            t.same(somethingelse.clients.keys(), [ 'client0', 'client3' ], 'somethingelse has client0')
            this.off(context)
            updates()
          }, 100)
        }
      })
    }

    function updates () {
      t.same(clients[2].clients.keys(), [ 'client2', 'client4', 'client5' ], 'correct clients on non-context')
      clients[2].set({ yuzi: 'hello' })
      getAll('yuzi', 'hello').then(() => {
        t.ok(true, 'update origin field "yuzi" all clients get updated')
        clients[4].yuzi.set('glurf')
        return getAll('yuzi', 'glurf')
      }).then(() => {
        t.ok(true, 'update origin field "yuzi" again all clients get updated')
        clients[2].context.set('someuser')
        return clients[1].clients.is((val, data, stamp, target) => target.keys().length > 1)
      }).then(() => {
        t.ok(true, 'change context of "client2" to "someuser"')
        clients[2].yuzi.set('sucker')
        return getContext('someuser', 'yuzi', 'sucker')
      }).then(() => {
        t.ok(true, 'update "yuzi" on context "someuser"')
        return getAll('yuzi', 'glurf', 'someuser')
      }).then(() => {
        t.ok(true, 'did not update other contexts')
        clients[4].yuzi.set('flurp')
        return getAll('yuzi', 'flurp', 'someuser')
      }).then(() => {
        t.ok(true, 'set origin field "yuzi" to "flurp", did not update other contexts')
        clients[4].set({ james: 'hello' })
        return getAll('james', 'hello')
      }).then(() => {
        t.ok(true, 'set origin field "james" to "hello" updates all')
      })
      .then(end).catch(err => console.log(err))
      // make more complex subs after this one
    }

    function end () {
      server.remove()
      clients.forEach(client => client.remove())
      t.end()
    }
  })

  function getAll (field, val, exclude) {
    const arr = []
    clients.map(client => {
      if (!exclude || client.context.compute() !== exclude) {
        arr.push(client.get(field, {}).is(val))
      }
    })
    return Promise.all(arr)
  }

  function getContext (context, field, val) {
    return Promise.all(
      server.getContext(context).clients.keys()
      .map(key => clients[key.slice(6)].get(field, {}).is(val))
    )
  }
})

function logClients (server) {
  console.log('no-context: ' + server.clients.keys().join(', '))
  server.instances.forEach(val =>
    console.log(val.context.compute() + ': ' + val.clients.keys().join(', '))
  )
}

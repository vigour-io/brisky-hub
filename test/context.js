'use strict'
const test = require('tape')
const Hub = require('../')

test('context', function (t) {
  const subs = {
    x: { val: true },
    james: { val: true },
    yuzi: { val: true },
    originfield: { val: true },
    hello: { val: true },
    animal: {
      $test: {
        exec: (state) => {
          return state && state.compute() === 'dog'
        },
        $pass: {
          diet: { val: true }
        }
      }
    },
    deeper: {
      animal: {
        $test: {
          exec (state) {
            return state && state.compute() === 'doge'
          },
          $pass: {
            diet: { val: true }
          }
        }
      }
    },

    // why does any not work???
    clients: { val: true }  // $any: { val: true } -- does not work as expected!
  }

  const sort = (a, b) => {
    a = Number(a.slice(6))
    b = Number(b.slice(6))
    return a > b ? 1 : -1
  }

  const clientssort = {
    sort: {
      val: 'key',
      exec: sort
    }
  }

  const server = new Hub({
    id: 'server',
    port: 6000,
    clients: clientssort
  })

  const clients = []

  for (let i = 0; i < 25; i++) {
    clients.push(new Hub({
      id: 'client' + i,
      context: false,
      url: 'ws://localhost:6000',
      clients: {
        sort: {
          val: 'key',
          exec: sort
        }
      }
    }))
    clients[i].subscribe(subs)
  }

  clients[0].set({ x: true })

  server.get('x', false).is(true).then(() => {
    // may need context as well for each client else it just weird
    clients[0].set({ context: 'someuser', hello: true })

    const originClients = clients
        .map(client => client.id)
        .filter(id => id !== 'client0')

    const arr = clients.filter(client => client.id !== 'client0')
      .map(client => client.clients.is(
        () => {
          const result = client.clients.keys()[0] !== 'client0' &&
            client.clients.keys().length === originClients.length
          if (result) {
            t.same(client.clients.keys(), originClients, 'correct clients for ' + client.id)
            return result
          }
        }
      )
    )

    server.on(function context (val, stamp) {
      if (val.context) {
        this.off(context)
        arr.push(this.context.is('someuser'))
        Promise.all(arr).then(() => {
          t.ok(true, 'server received context')
          t.equal(server.instances.length, 1, 'server has an extra instance')
          t.same(server.clients.keys(), originClients, 'client0 removed from server clients')
          const instance = server.instances[0]
          t.ok(instance.clients !== server.clients, 'created new clients object for instance')
          t.same(instance.clients.keys(), [ 'client0' ], 'instance has client0')
          t.same(clients[0].clients.keys(), [ 'client0' ], 'client0 has correct clients')
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
        })
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
          this.off(context)
          Promise.all([
            clients[3].clients.is(() => {
              return clients[3].clients.keys().length === 2
            })
          ]).then(() => {
            t.equal(server.instances.length, 2, 'server has an extra instance')
            const someuser = server.instances[0]
            const somethingelse = server.instances[1]
            t.same(someuser.clients.keys(), [ 'client1' ], 'someuser has client1')
            t.same(somethingelse.clients.keys(), [ 'client0', 'client3' ], 'somethingelse has client0')
            updates()
          })
        }
      })
    }

    function updates () {
      t.same(clients[2].clients.keys(), server.clients.keys(), 'correct clients on non-context')
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

        server.set({
          animal: {
            val: 'james',
            diet: 'coffee'
          }
        })

        return new Promise(resolve => {
          setTimeout(() => {
            t.same(clients.map(client => client.animal), clients.map(() => undefined), 'does not send animal "james"')
            server.set({
              animal: {
                val: 'dog',
                diet: 'coffee'
              }
            })
            getAll('animal.diet', 'coffee').then(() => {
              t.ok(true, 'send animal when its a dog')
              resolve()
            })
          }, 500)
        })
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

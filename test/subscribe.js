'use strict'
const test = require('tape')
const Hub = require('../')
const vstamp = require('vigour-stamp')

test('subscribe - exec function gaurds', (t) => {
  const server = new Hub({ port: 6000 })

  const client = new Hub({
    id: 1,
    context: false
  })
  client.subscribe({
    bla: {
      $test: {
        $: { title: { val: true } },
        $pass: { title: { val: true } },
        exec (state, subs, tree, key) {
          return state.blabla.gurken === true
        }
      }
    }
  })

  process.nextTick(() => client.set({ url: 'ws://localhost:6000' }))

  server.once('error', (err) => {
    t.equal(
      err.message.indexOf('cannot run function $test.exec'),
      0,
      'emits run error for false exec'
    )
    const subsHash = Object.keys(client.subscriptions)[0]
    const subsId = client.id + subsHash
    process.nextTick(() => {
      t.same(
        server.emitters.subscription.attach.keys(),
        [ subsId ],
        'correct subscription listeners on server'
      )
      client.client.origin().sendMeta()
    })
    setTimeout(() => {
      t.same(
        server.emitters.subscription.attach.keys(),
        [ subsId ],
        'correct subscription listeners after resending subscriptions on server'
      )
      client.subscriptions[subsHash].bla.$test['$fn|exec'] = 'im trolling'
      client.client.origin().sendMeta()
      server.once('error', (err) => {
        t.equal(
          err.message.indexOf('cannot parse function $test.exec'),
          0,
          'emits parse error for illegal function'
        )
        client.remove()
        server.clients.once((val, stamp) => {
          vstamp.done(stamp, () => {
            t.same(
              server.emitters.subscription.attach.keys(),
              [],
              'correct subscriptions listeners on server after removing client'
            )
            server.remove()
            t.end()
          })
        })
      })
    }, 500)
  })
})

test('subscribe - client', { timeout: 1e3 }, (t) => {
  const server = new Hub({
    id: 'server',
    port: 6000,
    field: '$root.a'
  })
  const client = new Hub({
    id: 1,
    context: false,
    url: 'ws://localhost:6000'
  })
  client.subscribe({
    client: {
      ip: { val: true }
    },
    bla: {
      $root: {
        client: {
          platform: { val: true }
        }
      }
    },
    gurk: {
      $parent: {
        client: { device: { val: true } }
      }
    }
  })
  client.get('client.origin.platform', {}).once((val, stamp) => {
    vstamp.done(stamp, () => {
      t.same(client.client.origin().serialize(), {
        id: 1,
        platform: 'node.js',
        ip: '::ffff:127.0.0.1',
        device: 'server'
      }, 'receive subscription')
      client.remove()
      server.remove()
      t.end()
    })
  })
})

test('subscribe - switch', { timeout: 1e3 }, (t) => {
  // make this failing
  const server = new Hub({
    id: 'server',
    port: 6000,
    field: '$root.a',
    a: { title: 'it\'s a' },
    b: {
      title: 'it\'s b',
      c: { d: 'hello' }
    },
    items: [
      { title: '#1', description: 'its #1' },
      { title: '#2', description: 'its #2' }
    ]
  })
  const client = new Hub({
    id: 1,
    context: false,
    url: 'ws://localhost:6000'
  })
  const client2 = new Hub({
    id: 2,
    context: false,
    url: 'ws://localhost:6000'
  })
  const subs = {
    items: {
      $any: {
        title: { val: true }
      }
    },
    // b: { val: 1 },
    field: {
      val: 1, // this should not be nessecary -- add val: 1 or somethign when switch or listen to switch
      $switch: {
        val: true, // support this
        $remove: true,
        exec (state) {
          return state.key
        },
        a: {
          val: 1,
          $remove: true,
          title: { val: true }
        },
        b: {
          val: 1,
          $remove: true,
          title: { val: true },
          c: { d: { val: true } },
          $root: {
            items: {
              $any: {
                title: { val: true },
                description: { val: true }
              }
            }
          }
        }
      }
    }
  }

  const clientUpdates = []
  client.subscribe(subs, state => {
    // console.log('hello', state.path())
    if (state) { clientUpdates.push(state.path()) }
  })

  const client2Updates = []
  client2.subscribe(subs, state => {
    if (state) { client2Updates.push(state.path()) }
  })

  client.get('field', {}).once((val, stamp) => vstamp.done(stamp, () => {
    t.same(client.field.val, client.a, 'client receives reference on "field"')
    t.same(client.a.title.val, 'it\'s a', 'client receives "a.title"')
    console.log(' \nSWITCH')
    client.set({ field: '$root.b' })
    Promise.all([
      client2.get('b.title', {}).is('it\'s b'),
      client.get('b.title', {}).is('it\'s b'),
      client2.get('field', {}).is(client2.b),
      client.get('field', {}).is(client.b)
    ]).then(() => {
      t.ok(true, 'client2 received "b.title"')
      t.ok(true, 'client received "b.title"')
      t.ok(true, 'client2 received "field"')
      t.ok(true, 'client received "field"')

      console.log('hello?', clientUpdates)

      client2Updates.forEach(val2 => {
        var found
        clientUpdates.forEach(val => {
          if (val.join('.') === val2.join('.')) {
            found = true
          }
        })
        if (!found) {
          t.fail(`cant find "${val2.join('.')}" in client 1 updates`)
        }
      })
      client.remove()
      client2.remove()
      server.remove()
      t.end()
    }).catch(err => console.log(err))
  }))
})

'use strict'
const test = require('tape')
const Hub = require('../')

test('subscribe - exec function gaurds', function (t) {
  const server = new Hub({ port: 6000 })

  const client = new Hub({
    id: 1,
    url: 'ws://localhost:6000',
    context: false
  })

  client.subscribe({
    bla: {
      $test: {
        $: {
          title: { val: true }
        },
        $pass: {
          title: { val: true }
        },
        exec (state, subs, tree, key) {
          return state.blabla.gurken === true
        }
      }
    }
  })

  server.once('error', (err) => {
    t.equal(err.message.indexOf('cannot run function $test.exec'), 0, 'throws run error for false exec')
    const subsHash = Object.keys(client.subscriptions)[0]
    const subsId = client.id + subsHash
    // make a guard for reparsing
    process.nextTick(() => {
      t.same(server.emitters.subscription.attach.keys(), [ subsId ], 'correct subscription listeners')
      client.client.origin().sendMeta()
    })
    setTimeout(() => {
      t.same(server.emitters.subscription.attach.keys(), [ subsId ], 'correct subscription listeners after resending subscriptions')
      client.subscriptions[subsHash].bla.$test['$fn|exec'] = 'im trolling'
      client.client.origin().sendMeta()
      server.once('error', (err) => {
        t.equal(err.message.indexOf('cannot parse function $test.exec'), 0, 'throws parse error for illegal function')
        client.remove()
        server.remove()
        t.end()
      })
    }, 500)
  })
})

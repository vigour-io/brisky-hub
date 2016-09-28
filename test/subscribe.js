'use strict'
const test = require('tape')
const Hub = require('../')
const vstamp = require('vigour-stamp')

// test('subscribe - exec function gaurds', function (t) {
//   const server = new Hub({ port: 6000 })

//   const client = new Hub({
//     id: 1,
//     context: false
//   })
//   client.subscribe({
//     bla: {
//       $test: {
//         $: { title: { val: true } },
//         $pass: { title: { val: true } },
//         exec (state, subs, tree, key) {
//           return state.blabla.gurken === true
//         }
//       }
//     }
//   })

//   process.nextTick(() => client.set({ url: 'ws://localhost:6000' }))

//   server.once('error', (err) => {
//     t.equal(
//       err.message.indexOf('cannot run function $test.exec'),
//       0,
//       'emits run error for false exec'
//     )
//     const subsHash = Object.keys(client.subscriptions)[0]
//     const subsId = client.id + subsHash
//     process.nextTick(() => {
//       t.same(
//         server.emitters.subscription.attach.keys(),
//         [ subsId ],
//         'correct subscription listeners on server'
//       )
//       client.client.origin().sendMeta()
//     })
//     setTimeout(() => {
//       t.same(
//         server.emitters.subscription.attach.keys(),
//         [ subsId ],
//         'correct subscription listeners after resending subscriptions on server'
//       )
//       client.subscriptions[subsHash].bla.$test['$fn|exec'] = 'im trolling'
//       client.client.origin().sendMeta()
//       server.once('error', (err) => {
//         t.equal(
//           err.message.indexOf('cannot parse function $test.exec'),
//           0,
//           'emits parse error for illegal function'
//         )
//         client.remove()
//         server.clients.once((val, stamp) => {
//           vstamp.done(stamp, () => {
//             t.same(
//               server.emitters.subscription.attach.keys(),
//               [],
//               'correct subscriptions listeners on server after removing client'
//             )
//             server.remove()
//             t.end()
//           })
//         })
//       })
//     }, 500)
//   })
// })

test('subscribe - switch', function (t) {
  const server = new Hub({
    id: 'server',
    port: 6000,
    field: '$root.a',
    a: { title: 'it\'s a' },
    b: { title: 'it\'s b' }
  })

  const client = new Hub({
    id: 1,
    context: false,
    url: 'ws://localhost:6000'
  })

  client.subscribe({
    field: {
      $remove: true,
      val: 1, // this should not be nessecary -- add val: 1 or somethign when switch or listen to switch
      $switch: {
        $remove: true,
        exec (state) {
          return state.key
        },
        a: { val: 1, $remove: true, title: { val: true } },
        b: { val: 1, $remove: true, title: { val: true } }
      }
    }
  })

  client.get('field', {}).once((val, stamp) => vstamp.done(stamp, () => {
    t.same(client.field.val, client.a, 'client receives reference on "field"')
    t.same(client.a.title.val, 'it\'s a', 'client receives "a.title"')
    client.set({ field: '$root.b' })
    client.field.once((val, stamp) => vstamp.done(stamp, () => {
      t.same(client.field.val, client.b, 'client receives reference on "field"')
      t.same(client.b.title.val, 'it\'s b', 'client receives "b.title"')
      client.remove()
      server.remove()
      t.end()
    }))
  }))
})

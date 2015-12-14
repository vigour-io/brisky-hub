'use strict'
var Observable = require('vigour-js/lib/observable')
// Observable.prototype.inject(require('vigour-js/li'))
var colors = require('colors-browserify')
var Hub = require('../../lib')

// var server = global.server = new Hub({
//   key: 'server',
//   adapter: {
//     id: 'randomserver',
//     inject: require('../../lib/protocol/mock/'),
//     mock: {
//       server: 'testserver'
//     }
//   }
// })

var server2 = global.server2 = new Hub({
  key: 'server2',
  adapter: {
    id: 'randomserver2',
    inject: require('../../lib/protocol/mock/'),
    mock: {
      // val:'testserver',
      server: 'testserver2'
    }
  }
})

// server.get('time', {})
// server2.get('time', {})

var client = global.client = new Hub({
  adapter: {
    id: 'testclient',
    inject: require('../../lib/protocol/mock'),
    // val: 'ws://localhost:3031'
    mock: 'testserver2'
  }
})

var client2 = global.client2 = new Hub({
  adapter: {
    id: 'testclient2',
    inject: require('../../lib/protocol/mock'),
    // val: 'ws://localhost:3031'
    mock: 'testserver2'
    // scope: 'murder'
  }
})

// client2.adapter.scope.val = 'murder'

// client.get('time', {})
// client2.get('time', {})

// client.adapter.mock.connected.is(true, function () {
  // console.log('lullllzzzzzz'.rainbow)
  // setTimeout(() => {
  //   // console.clear()
  //   server.set({
  //     time: 222
  //   })
  // }, 100)
// })

// client.subscribe({
//   time: true
// }, function (data, event) {
//   for (var i in data) {
//     // here we want the real data!
//     console.log('hello', data[i].origin.path.join('.'), data[i].data, event)
//     // console.log(data[i].origin._on.data.getBound(event, this).data)
//   }
// })
//
// client.time.on(function (data) {
//   console.log('mystery ballz', data)
// })
//
// client2.time.on(function (data) {
//   console.log('mystery ballz -- 2', data)
//   // client2.set({
//   //   time: 88888888
//   // })
// })

console.line = false

// setTimeout(function () {
  // console.clear()
  // client2.subscribe({
  //   time: true
  //   // flurps: true
  // }, function (data, event) {
  //   for (var i in data) {
  //     // here we want the real data!
  //     console.log('hello', data[i].origin.path.join('.'), data[i].data, event)
  //     // console.log(data[i].origin._on.data.getBound(event, this).data)
  //   }
  // })

  // console.log('ok expect 222 myster ballz 2 to fire')
// }, 2000)


// client.set({flurps: true})

// var o = new Observable({
//   x: true
// })

// o.x.subscribe({
//   $upward: {
//     time: true
//   }
// }, function (data, event) {
//   console.log('unicorns'.rainbow, event, data)
// })

setTimeout(() => {
  console.clear()
  client.subscribe({
    time: true
  }, function () {
    console.log('unicorns'.rainbow)
  })
  // o.val = client
}, 500)

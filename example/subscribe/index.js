'use strict'
var Observable = require('vigour-js/lib/observable')
// Observable.prototype.inject(require('vigour-js/li'))
var colors = require('colors-browserify')

var Hub = require('../../lib')

var server = global.server = new Hub({
  adapter: {
    id: 'randomserver',
    inject: require('../../lib/protocol/mock/'),
    mock: {
      server: 'testserver'
    }
  }
})

server.get('time', {})

var client = global.client = new Hub({
  adapter: {
    id: 'testclient',
    inject: require('../../lib/protocol/mock'),
    // val: 'ws://localhost:3031'
    mock: 'testserver'
  }
})

client.get('time', {})

client.adapter.mock.connected.is(true, function () {
  console.log('lullllzzzzzz'.rainbow)
  setTimeout(() => {
    server.set({
      time: 222
    })
  }, 100)
})

client.subscribe({
  time: true
}, function (data, event) {
  for (var i in data) {
    // here we want the real data!
    console.log('hello', data[i].origin.path.join('.'), data[i].data, event)
    // console.log(data[i].origin._on.data.getBound(event, this).data)
  }
})

client.time.on(function (data) {
  console.log('mystery ballz', data)
})

client.set({flurps: true})

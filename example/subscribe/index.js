'use strict'
var Observable = require('vigour-js/lib/observable')
// Observable.prototype.inject(require('vigour-js/li'))
var colors = require('colors-browserify')

var Hub = require('../../lib')
var hub = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    val: 'ws://localhost:3031'
  },
  time: true
})

var a = new Observable({
  b: true,
  time: {
    on: {
      data () {}
    }
  }
})

hub.subscribe({
  time: true
}, function (data, event) {
  for (var i in data) {
    // here we want the real data!
    console.log('hello', data[i].origin.path.join('.'), data[i].data, event)

    // console.log(data[i].origin._on.data.getBound(event, this).data)
  }
})

hub.set({
  time: 222
})

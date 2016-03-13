'use strict'
var Hub = require('../../')
var hub = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3333
    }
  },
  // scope: function (scope, event, get) {
  //   console.log('go for scope:', scope)
  //   return get.apply(this, arguments)
  // },
  clients: {
    on: {
      // this is a bit shitty scope does not help us here
      property (data) {
        console.log(data)
      }
    }
  }
})
console.log('start hub', hub.adapter.id)

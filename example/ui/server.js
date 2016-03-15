'use strict'
var Hub = require('../../')
var hub = new Hub({
  adapter: {
    websocket: {
      server: 3334
    }
  },
  field: {
    on: {
      data (data, event) {
        console.log('got some datax!', data, event)
      }
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

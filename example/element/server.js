'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3031,
      val: 'ws://localhost:3033'
    }
  },
  scope: {
    marcus: {
      adapter: {
        websocket: 'ws://localhost:3032'
      }
    }
  }
})

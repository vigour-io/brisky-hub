'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3031
    }
  }
})

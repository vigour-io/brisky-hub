'use strict'
var Hub = require('../../')
var hub = new Hub({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3333
    }
  }
})

console.log('do we have a server hur?', hub)


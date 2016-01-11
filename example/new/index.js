'use strict'
require('./style.less')
var Hub = require('../../lib')
var hub = global.hub = new Hub()

hub.set({
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: 'ws://localhost:3031'
  }
})

// why not why not o why not!

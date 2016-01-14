'use strict'
var Hub = require('../../lib')
// var colors = require('colors-browserify')
// var http = require('http')
// var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'mtv',
    websocket: {}
  },
  scopes () {
    console.log('lulzzzz scope!', arguments)
  }
})

hub.adapter.websocket.val = 'ws://localhost:3031'
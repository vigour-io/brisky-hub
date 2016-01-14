process.stdout.write('\033c') //eslint-disableore-line
console.log('start scope!')
'use strict'
var Hub = require('../../lib')
var fs = require('fs')
// var colors = require('colors-browserify')
// var http = require('http')
// var JSONStream = require('JSONStream')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    // id: 'mtv',
    websocket: {}
  },
  // scopes () {
  //   console.log('lulzzzz scope!', arguments)
  // },
  textfield: 'from non-scoped server'
})

hub.adapter.websocket.set({
  server: 3031
})
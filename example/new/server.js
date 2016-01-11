process.stdout.write('\033c') //eslint-disableore-line

console.log('start!')

'use strict'
var Hub = require('../../lib')
var fs = require('fs')

var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3031
      // val: 'ws://localhost:3033'
    }
  },
  speed: {}
})

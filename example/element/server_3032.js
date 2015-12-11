'use strict'
var Hub = require('../../lib')
var hub = new Hub({ // eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3032
    }
  }
})

// fs.createWriteStream('')

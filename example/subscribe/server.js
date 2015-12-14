var Hub = require('../../lib')

var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3031
      // val: 'ws://localhost:3033'
    }
  }
})

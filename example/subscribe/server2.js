var Hub = require('../../lib')

var hub = new Hub({ //eslint-disable-line
  adapter: {
    id: 'funtimes2',
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3032
      // val: 'ws://localhost:3033'
    }
  }
})

require('colors-browserify')
console.log('server 2 start 3032:', hub.adapter.id.rainbow)

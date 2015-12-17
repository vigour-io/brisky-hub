var Hub = require('../../lib')

var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'myown',
    websocket: {
      server: 3031
    }
  }
})

require('colors-browserify')
console.log('server 1 start:', hub.adapter.id.rainbow)

var Hub = require('../../lib/')

var origin = new Hub({
  key: 'origin',
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection (data) {
        console.log('connected to:', this.val, data)
      },
      error (err) {
        console.error(this.path.join('.') + ' error ', err)
      }
    }
  },
  clients: {
    on: {
      property (data) {
        console.log('clients happenign!', data, Object.keys(this))
      }
    }
  }
})
// need to override blocks of listeners when in event in which listeners are added)
origin.adapter.val = 'ws://localhost:3031'

var duplex = new Hub({
  key: 'duplex',
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection (data) {
        console.log('connected to:', this.val, data)
      },
      error (err) {
        console.error(this.path.join('.') + ' error ', err)
      }
    }
  },
  clients: {
    on: {
      property (data) {
        console.log('clients happenign!', data, Object.keys(this))
      }
    }
  }
})
duplex.adapter.val = 'ws://localhost:3032'

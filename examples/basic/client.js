var Hub = require('../../lib/')

var origin = new Hub({
  key: 'singleserver',
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
    // clients will always be send for your own instances
    // we may need ip as well!
    on: {
      property (data) {
        console.log('clients', this.map((property, key) => key ))
      }
    }
  }
})
// need to override blocks of listeners when in event in which listeners are added)
//
console.error('lets start!!!!!', origin.clients)
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
// duplex.adapter.val = 'ws://localhost:3032'

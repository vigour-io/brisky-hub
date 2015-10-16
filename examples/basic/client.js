var Hub = require('../../lib/')

var a = new Hub({
  key: 'myOrigin',
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
a.adapter.val = 'ws://localhost:3031'

var b = new Hub({
  key: 'myHubBoth',
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
// b.adapter.val = 'ws://localhost:3031'

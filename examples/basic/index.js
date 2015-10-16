var Hub = require('../../lib/')
// var b = new Hub({})

var a = new Hub({
  key: 'myHubA',
  adapter: {
    inject: require('../../lib/adapter/websocket')
  },
  clients: {
    on: {
      property (data) {
        console.log('clients happenign!', data, Object.keys(this))
      }
    }
  }
})

a.adapter.listens.val = 3031

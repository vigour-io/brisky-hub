var Hub = require('../../lib')

var s1 = global.s1 = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        console.log('-- Connection')
      }
    }
  },
  clients: {
    on: {
      property (data, ev) {
        console.log('-- Property', ev.stamp, ev.type, JSON.stringify(data))
      }
    }
  }
})

s1.adapter.listens.val = 3031

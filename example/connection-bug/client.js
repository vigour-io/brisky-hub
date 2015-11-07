var Hub = require('../../lib')

var client = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        console.log('-- C1 Connected ')
      },
      error (err, ev) {
        console.log('-- C1 Error ', err.message, err.stack)
      }
    }
  },
  clients: {
    on: {
      property (data, ev) {
        console.log('-- C1 Property ', data)
      }
    }
  },
  on: {
    data () {
      console.log('-- C1 Data ')
    }
  }
})

setTimeout(() => { client.adapter.val = 3031 }, 200)
setTimeout(() => { client.adapter.val = 3032 }, 800)
// setInterval(() => { client.adapter.val = 3033 }, 1400)
// setInterval(() => { client.adapter.val = 3031 }, 2200)

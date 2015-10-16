var Hub = require('../../lib/')
// var b = new Hub({})

var a = new Hub({
  key: 'myHubA',
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
  }
})

a.adapter.val = 'ws://localhost:3031'

// function sendNumber () {
//   if (client.readyState === client.OPEN) {
//     var number = Math.round(Math.random() * 0xFFFFFF)
//     client.send(number.toString())
//     setTimeout(sendNumber, 1000)
//   }
// }
// sendNumber()

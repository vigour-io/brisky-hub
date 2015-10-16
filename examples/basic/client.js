var Hub = require('../../lib/')
// var b = new Hub({})

var a = new Hub({
  key: 'myHubA',
  adapter: {
    inject: require('../../lib/adapter/websocket')
  }
})

a.adapter.val = 'ws://localhost:3030'

// function sendNumber () {
//   if (client.readyState === client.OPEN) {
//     var number = Math.round(Math.random() * 0xFFFFFF)
//     client.send(number.toString())
//     setTimeout(sendNumber, 1000)
//   }
// }
// sendNumber()

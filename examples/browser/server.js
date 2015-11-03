'use strict'
var Hub = require('../../lib')
var hub = global.hub = new Hub({
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection () {
        // console.log('connected!')
      }
    }
  },
  clients: {
    on: {
      property (data) {
        // console.log(data)
      }
    }
  }
})

//require('../basic/dev').startRepl()

hub.adapter.listens.val = 3031

// setInterval(() => hub.set({bla: Math.random() * 9999}), 500)
// setTimeout(() => {
//   hub.set({
//     randomfield: true
//   })
// }, 2500)

'use strict'
require('./style.less')
var Hub = require('../../lib')
var hub = global.hub = new Hub()

// hub.set({
//   adapter: {
//     inject: require('../../lib/protocol/websocket'),
//     websocket: 'ws://localhost:3031'
//   }
// })

var Observable = require('vigour-js/lib/observable')
 var a = new Observable({
  text: {
    on: {
      data (data, event) {
        console.log(data, event)
      }
    }
  }
})

console.clear()
a.text.val = 'xxxxx'
// why not why not o why not!

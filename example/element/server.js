'use strict'
var Hub = require('../../lib')
var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3031,
      val: 'ws://localhost:3033'
    }
  },
  scope: {
    valerio: {
      adapter: {
        websocket: 'ws://localhost:3032'
      }
    }
  }
})










// function (key, event, get) {
//   console.log('---------SCOPE--------'.cyan)
//   // console.log(arguments)
//   var scope = get.call(this, key, event)
//   scope.set({
//     adapter: {
//       websocket: 'ws//:localhost:3032'
//     }
//   })
//   return scope
// }

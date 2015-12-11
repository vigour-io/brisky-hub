'use strict'
var Hub = require('../../lib')
var fs = require('fs')

var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    websocket: {
      server: 3031,
      val: 'ws://localhost:3033'
    }
  },
  speed: {

  },
  // video: fs.createReadStream('./a.mp4'),
  scope: {
    valerio: {
      adapter: {
        websocket: 'ws://localhost:3032'
      }
    }
  }
})

hub.speed.pipe(fs.createWriteStream('./output.txt'))

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

var Hub = require('../../lib')

var hub = new Hub({ //eslint-disable-line
  adapter: {
    inject: require('../../lib/protocol/websocket'),
    id: 'myown',
    websocket: {
      // val: 'ws://localhost:3032',
      server: 3031
    }
  },
  time: 'lulz hub',
  shows: {
    bla: {
      title: 'xxx'
    }
  }
})
//
// var hub = new Hub({ //eslint-disable-line
//   adapter: {
//     id: 'funtimes2',
//     inject: require('../../lib/protocol/websocket'),
//     websocket: {
//       server: 3032
//       // val: 'ws://localhost:3033'
//     }
//   }
// })

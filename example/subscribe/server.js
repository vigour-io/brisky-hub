process.stdout.write('\033c')

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
  // boeloe: {
  //   mybitch: 'lulz from the hub boeloe'
  // },
  mybitch: 'lulz from the hub',
  shows: {
    one: {
      title: 'xxx'
    },
    two: {
      title: 'xxx'
    },
    three: {
      title: 'xxx'
    }
  }
})

// hub.get('time', 'nothing')

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

require('colors-browserify')
console.log('server start:', hub.adapter.id.rainbow)

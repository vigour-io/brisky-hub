'use strict'
var isNode = require('vjs/lib/util/is/node')
var uuid = require('vjs/lib/util/uuid')
uuid = uuid.val = uuid.val + (isNode ? '_nc_' : '_bc_')

var Hub = require('../../lib/')
var dev = require('./dev')

var origin = new Hub({
  key: 'server',
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection (data) {
        console.log(uuid + ' connected to:', this.val)
      },
      error (err) {
        console.error(this.path.join('.') + ' error ', err)
      }
    }
  },
  clients: {
    // clients will always be send for your own instances
    // we may need ip as well!
    on: {
      property: dev.clients
    }
  },
  on: {
    data: dev.data
  }
})
// need to override blocks of listeners when in event in which listeners are added)
// console.error('lets start!!!!!', origin.clients)
// setTimeout(() => origin.adapter.val = 'ws://localhost:3031', 300)

if (!isNode) {
  window.hub = origin
}

var duplex = new Hub({
  key: 'duplex',
  adapter: {
    inject: require('../../lib/adapter/websocket'),
    on: {
      connection (data) {
        console.log(uuid, 'connected to:', this.val)
      },
      error (err) {
        console.error(this.path.join('.') + ' error ', err)
      }
    }
  },
  clients: {
    on: {
      property: dev.clients
    }
  },
  on: {
    data: {
      performance: dev.performance,
      // dev: dev.data
    }
  }
})

if (!isNode) {
  window.duplex = duplex
}

// var Observable = require('vjs/lib/observable')
// var a = new Observable({
//   inject: require('vjs/lib/operator/transform'),
//   val: duplex
//   // $transform: function() {
//   //
//   // }
// })

if (isNode) {
  // var fs = require('fs')
  // var writeStream = fs.createWriteStream('./log/' + uuid + '.txt')
  // duplex.pipe(process.stdout)
  // duplex.pipe(writeStream)
}

setTimeout(() => duplex.adapter.val = 'ws://localhost:3032', 1000)
require('./dev').randomUpdate(duplex, 0 )
// require('./dev').randomUpdate(origin)
// var a = new Hub('mtv.vigour.io')
// a = new Hub({ listen: 2020 })
// a.listen.val = 2020

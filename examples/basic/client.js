'use strict'
var isNode = require('vjs/lib/util/is/node')
var uuid = require('vjs/lib/util/uuid')
uuid = uuid.val = uuid.val + (isNode ? '_node_client' : '_browser_client')
var Hub = require('../../lib/')
var dev = require('./dev')

var duplex = new Hub({
  key: 'duplex',
  adapter: {
    inject: dev.protocol,
    on: {
      connection (data) {
        // console.log(uuid, 'connected to:', this.val)
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

global.duplex = duplex

setTimeout(() => duplex.adapter.val = 3032, 1000)
require('./dev').startRepl()
// require('./dev').randomUpdate(duplex, 0)
// setTimeout(() => duplex.val = { x: Math.random() * 100 }, 1500)

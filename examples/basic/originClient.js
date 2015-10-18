'use strict'
var isNode = require('vjs/lib/util/is/node')
var uuid = require('vjs/lib/util/uuid')
uuid = uuid.val = uuid.val + (isNode ? '_server-client' : '_origin-browser')

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
setTimeout(() => origin.adapter.val = 'ws://localhost:3031', 300)
require('./dev').randomUpdate(origin)
require('./dev').startRepl()

global.hub = origin

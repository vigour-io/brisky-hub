'use strict'
var isNode = require('vjs/lib/util/is/node')
var uuid = require('vjs/lib/util/uuid')
uuid = uuid.val = uuid.val + (isNode ? '_nodeclient' : '_browserclient')

var Hub = require('../../lib/')
var log = require('./log')

var origin = new Hub({
  key: 'singleserver',
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
      property: log.clients
    }
  }
})
// need to override blocks of listeners when in event in which listeners are added)
//
// console.error('lets start!!!!!', origin.clients)
setTimeout(() => origin.adapter.val = 'ws://localhost:3031', 100)

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
      property: log.clients
    }
  }
})

setTimeout(() => duplex.adapter.val = 'ws://localhost:3032', 100)

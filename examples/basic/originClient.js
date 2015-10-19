'use strict'
var isNode = require('vjs/lib/util/is/node')
var uuid = require('vjs/lib/util/uuid')
uuid = uuid.val = uuid.val + (isNode ? '_server_client' : '_origin-browser')

var Hub = require('../../lib/')
var dev = require('./dev')

var origin = new Hub({
  key: 'server',
  adapter: {
    inject: dev.protocol,
    on: {
      connection (data) {
        console.log(uuid + ' connected to:', this.val)
      },
      error (err) {
        console.log(err.message.red)
        throw new Error('!')
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
    data: {
      performance: dev.performance,
      // dev: dev.data
    }
  }
})

// var fs = require('fs')


var request = require('request')

setTimeout(() => {
  // 'http://img0.mxstatic.com/wallpapers/58487114d3d7fedde7a01048546c06b1_large.jpeg
  // request('http://img0.mxstatic.com/wallpapers/58487114d3d7fedde7a01048546c06b1_large.jpeg')
  //   .pipe(origin.stream)
}, 1500)

// need to override blocks of listeners when in event in which listeners are added)
// console.error('lets start!!!!!', origin.clients)
setTimeout(() => origin.adapter.val = 3031, 300)
require('./dev').randomUpdate(origin, 100)

global.hub = origin

require('./dev').startRepl()

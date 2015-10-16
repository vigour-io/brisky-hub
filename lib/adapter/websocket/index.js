'use strict'
var webSocket = require('websocket')
var isNode = require('vjs/lib/util/is/node')

if (isNode) {
  let server = require('./server.js')
  // config ofcourse
  server.start()
}

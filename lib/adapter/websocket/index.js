'use strict'
var webSocket = require('websocket')

exports.port = {
  on: {
    data: {
      websocket: function () {
        console.log('port lets set it! (this is a connnector!)')
      }
    }
  }
}

// replace this with seperate file (using pckg.json browser)
var isNode = require('vjs/lib/util/is/node')
if (isNode) {
  exports.inject = require('./server')
}

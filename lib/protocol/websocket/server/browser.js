'use strict'
// var Emitter = require('vigour-js/lib/emitter')
var WsServer = require('websocket').server
// exports.inject = require('')

exports.server = {
  on: {
    data: {
      server (data, event) {
        console.error('websocket-server is not supported in the browser', this.val)
      }
    }
  }
}

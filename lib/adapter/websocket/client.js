'use strict'
var W3CWebSocket = require('websocket').w3cwebsocket
var Connection = require('./connection')

exports.on = {
  value: {
    websocket (data, event) {
      var adapter = this
      var connnection = new Connection({
        url: 'test'
      })
    }
  }
}

exports.properties = {
  websocketClient: true
}



/*
  protocol is a thing that has everything
    clients have connections



 */

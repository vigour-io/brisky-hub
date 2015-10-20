'use strict'
// TODO check if client is already there and change the connection to the new WS Server
//
/* dependencies */
var Connection = require('../../connection')
var W3CWebSocket = require('websocket').w3cwebsocket
var isNumber = require('vjs/lib/util/is/numberlike')
var Event = require('vjs/lib/event')
var WsProtocol = require('./protocol')

var wsConnection = new Connection({
  protocol: new WsProtocol()
})

wsConnection.define({
  connect (url, event) {
    console.log('ws connect called', url, event)
    this.setKey('url', 'sdsdsd')
  }
})

module.exports = wsConnection.Constructor

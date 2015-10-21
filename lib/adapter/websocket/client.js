'use strict'
var W3CWebSocket = require('websocket').w3cwebsocket
var Event = require('vjs/lib/event')

exports.on = {
  value: {
    websocket (data, event) {
      var val = this.val
      if(typeof val !== 'string') {
        val = 'ws://localhost:' + val
      }
      this.startWebsocketClient(val, event)
    }
  }
}

exports.properties = {
  websocketClient: true
}

exports.define = {
  startWebsocketClient (url, event) {
    var wsClient = this.websocketClient = new W3CWebSocket(url, 'upstream')
    var adapter = this
    // context be carefull! -- needs to set to correct instance of hub
    var client = this.getClient(event)
    wsClient.onerror = function () {
      adapter.emit('error', new Error('Connection Error'))
    }

    wsClient.onopen = function () {
      // new event? else its allready processed!
      let event = new Event(adapter, 'connection')
      client.connection = wsClient
      wsClient.send(JSON.stringify({
        client: client.serialize(),
        stamp: event.stamp
      }))
      adapter.emit('connection', client, event)
    }

    wsClient.onclose = function () {
      // lets try to reconnect we can make a strategy for this!
      adapter.emit('close', client)
    }

    wsClient.onmessage = function (e) {
      adapter.parse(JSON.parse(e.data), 'upstream')
    }
  }
}

'use strict'
var W3CWebSocket = require('websocket').w3cwebsocket

exports.on = {
  value: {
    websocket () {
      this.startWebsocketClient(this.val)
    }
  }
}

exports.properties = {
  websocketClient: true
}

exports.define = {
  startWebsocketClient (url) {
    console.log('init ws client', url)
    var wsClient = this.websocketClient = new W3CWebSocket(url, 'upstream')
    var adapter = this
    // context be carefull! -- needs to set to correct instance of hub
    var client = this.getClient()
    console.log('client id:', client.val)

    wsClient.onerror = function () {
      adapter.emit('error', new Error('Connection Error'))
    }

    wsClient.onopen = function () {
      console.log('--> client id', client.val)
      wsClient.send(JSON.stringify({
        $client: client.val
        // $instance: this can then set the current client to the correct instance!
      }))
      adapter.emit('connection', client)
    }

    wsClient.onclose = function () {
      // lets try to reconnect we can make a strategy for this!
      adapter.emit('close', client)
    }

    wsClient.onmessage = function (e) {
      adapter.parse(JSON.stringify(e.data))
    }
  }
}

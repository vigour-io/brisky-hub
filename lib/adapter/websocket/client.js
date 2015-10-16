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
    // not echo protocol prob
    var client = this.websocketClient = new W3CWebSocket('ws://localhost:3031/', 'upstream')
    var adapter = this

    client.onerror = function () {
      adapter.emit('error', new Error('Connection Error'))
    }

    client.onopen = function () {
      if (!adapter.client) {
        // client takes care of localstorage etc -- will also get an id generator
        adapter.setKey('client', {
          val: ~~(Math.random() * 100000),
          connection: client
        })
      }
      client.send(JSON.stringify({
        $client: adapter.client.val
        // $instance: this can then set the current client to the correct instance!
      }))
      adapter.emit('connection', adapter.client)
    }

    client.onclose = function () {
      // lets try to reconnect we can make a strategy for this!
      adapter.emit('close', adapter.client)
    }

    client.onmessage = function (e) {
      adapter.parse(JSON.stringify(e.data))
    }
  }
}

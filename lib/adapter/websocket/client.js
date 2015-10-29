'use strict'
var W3CWebSocket = require('websocket').w3cwebsocket
var Event = require('vjs/lib/event')
var Connection = require('./connection')

exports.on = {
  value: {
    websocket (data, event) {
      var val = this.val
      if (typeof val !== 'string') {
        val = 'ws://localhost:' + val
      }
      try {
        this.startWebsocketClient(val, event)
      } catch (err) {
        this.emit('error', err)
      }
    }
  }
}

exports.properties = {
  websocketClient: true
}

exports.define = {
  startWebsocketClient (url, event) {
    var adapter = this
    var client = this.getClient(event)
    var connection = new Connection(url, 'upstream')
    // override default listeners
    connection.onError = () => {
      adapter.emit('error', new Error('Connection error'))
    }
    connection.onDisconnect = (code, description) => {
      adapter.emit('close', client)
    }
    connection.onConnect = () => {
      client.connection = connection.client
      let event = new Event(adapter, 'connection')
      let connect = {
        client: client.serialize(),
        stamp: event.stamp
      }
      if (typeof adapter.instance.val === 'string') {
        connect.instance = adapter.instance.val
      }
      client.connection.send(JSON.stringify(connect))
      adapter.emit('connection', client, event)
    }
    // default listeners
    connection.on('data', (payload) => {
      adapter.parse(JSON.parse(payload), 'upstream')
    })
  }
}

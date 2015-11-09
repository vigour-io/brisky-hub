'use strict'
var Event = require('vigour-js/lib/event')
var Connection = require('./connection')

exports.on = {
  value: {
    websocket (data, event) {
      try {
        this.startWebsocketClient('ws://localhost:' + this.val, event)
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
    var connection = new Connection()
    var client = this.getClient(event, connection)
    connection.connect(url, 'upstream')
    connection.on('error', function () {
      adapter.emit('error', new Error('Connection error'))
    })
    connection.on('disconnect', function () {
      adapter.emit('close', client)
    })
    connection.on('connect', function () {
      // client.connection = this
      let event = new Event(adapter, 'connection')
      let connect = {
        client: client.serialize(),
        stamp: event.stamp
      }
      if (typeof adapter.scope.val === 'string') {
        connect.scope = adapter.scope.val
      }
      connection.send(JSON.stringify(connect))
      adapter.emit('connection', client, event)
    })
    connection.on('message', (data) => {
      adapter.parse(JSON.parse(data), 'upstream')
    })
  }
}

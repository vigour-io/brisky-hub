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
    var client = this.getClient(event)
    if (client.connection) {
      client.connection.remove()
    }
    var connection = client.connection = new Connection({
      on: {
        error () {
          adapter.emit('error', new Error('Connection error'))
        },
        close () { // TODO refactor to close
          adapter.emit('close', client)
        },
        open () {
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
        },
        message (payload) {
          adapter.parse(JSON.parse(payload), 'upstream')
        }
      }
    })
    connection.set({url: url, secret: 'upstream'})
  }
}

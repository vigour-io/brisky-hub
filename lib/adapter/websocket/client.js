'use strict'
var Event = require('vigour-js/lib/event')
var Connection = require('./connection')

exports.on = {
  value: {
    websocket (data, event) {
      try {
        console.log('ok wtf wtf wtf!!!', this.val)
        this.startWebsocketClient('ws://localhost:' + this.val, event)
      } catch (err) {
        console.log('ERROR!!!!!', err)
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
    console.log('    starting client', url, this.path, this._path)
    var adapter = this
    var client = this.getClient(event)
    console.log('!!!client biatch!', client.path)
    console.log('!!!make a new connection!', url)
    var a = client.path
    console.log('this one!', a)
    var connection = new Connection()
    connection.connect(url, 'upstream')
    connection.on('error', function () {
      adapter.emit('error', new Error('Connection error'))
    })
    connection.on('disconnect', function () {
      adapter.emit('close', client)
    })
    connection.on('connect', function () {
      client.connection = connection
      console.log('!!!connection biatch!', client.path, a)

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
    connection.on('data', (payload) => {
      adapter.parse(JSON.parse(payload), 'upstream')
    })
  }
}

'use strict'
var W3CWebSocket = require('websocket').w3cwebsocket
var Client = require('../../client')
var Event = require('vjs/lib/event')

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
    var hub = adapter.parent //context be carefull! -- needs to set to correct instance of hub

    client.onerror = function () {
      adapter.emit('error', new Error('Connection Error'))
    }

    client.onopen = function () {
      if (!adapter.client) {
        // client takes care of localstorage etc -- will also get an id generator
        let initEvent = new Event(adapter, 'init')
        // -------- move this --------
        // check if client allready exists!
        let id = ~~(Math.random() * 10)
        adapter.set({
          client: id
        }, initEvent)
        // initEvent should not be synced!
        // makes reference tomyself in hubs clients object -- this is handy for reference
        hub.set({
          clients: { [id]: adapter.client }
        }, initEvent)
        // --------------------------
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

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
    var client = this.websocketClient = new W3CWebSocket(url, 'upstream')
    var adapter = this

    // context be carefull! -- needs to set to correct instance of hub
    var hub = adapter.parent

    if (!this.client) {
      // client takes care of localstorage etc -- will also get an id generator
      // -------- move this --------
      // init events are checked
      let createClient = new Event(adapter, 'init')
      let id = ~~(Math.random() * 10)
      // these types are ignored in sets to the upstream
      adapter.set({ client: id }, createClient)
      // makes reference tomyself in hubs clients object -- this is handy for reference
      hub.set(
        { clients: { [id]: adapter.client } },
        createClient
      )
      adapter.emit('init', this.client, createClient)
      // --------------------------
    }

    client.onerror = function () {
      adapter.emit('error', new Error('Connection Error'))
    }

    client.onopen = function () {

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

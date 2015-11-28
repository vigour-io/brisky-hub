'use strict'
var Connection = require('../connection')
var WsClient = require('websocket').w3cwebsocket

module.exports = new Connection({
  reconnectTime: 10,
  properties: {
    internal: true
  },
  upstream: {
    on: {
      data: {
        mock (data, event) {
          if (data === null) {
            console.warn('removing connection dont worry about it for now! -- add more here later')
            return
          }
          if (this.parent.internal) {
            console.log('allready have internal dont do it now (for now)')
            return
            // this.parent.internal.emit('close')
            // this.parent.internal._serverside.emit('close')
            // this.parent.internal.remove(event)
          }
          var wsClient = new WsClient(this.val, 'hubs')
          // wsClient.onerror = (err) => { }
          wsClient.onmessage = (data) => {
            this.parent.emit('message', JSON.parse(data.data))
          }
          wsClient.onopen = () => {
            this.parent.emit('connect')
          }
          wsClient.onclose = () => {
            this.parent.emit('close')
          }
          var internal = this.parent.internal = wsClient
        }
      }
    }
  },
  define: {
    send (data) {
      if (this.internal.readyState > 0 || typeof this.upstream.val !== 'string') {
        console.log('yes!', data)
        this.internal.send(JSON.stringify(data))
      } else {
        // here we need queue can be put on the protocol layer
        console.log('no!', data)
        // this.internal.send(data)
      }
    }
  }
}).Constructor
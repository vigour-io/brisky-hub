'use strict'
var Connection = require('../connection')
var WsClient = require('websocket').w3cwebsocket

module.exports = new Connection({
  upstream: {
    inject: require('vigour-js/lib/operator/type'),
    $type: 'url',
    on: {
      data: {
        mock (data, event) {
          var val = this.val
          if (!val) {
            return
          }
          if (data === null) {
            console.warn('removing connection dont worry about it for now! -- add more here later')
            return
          }
          if (this.parent.internal) {
            return
          }
          let wsClient = this.parent.internal = new WsClient(val, 'hubs')
          wsClient.onerror = (err) => {
            this.parent.emit('error', err)
          }
          wsClient.onmessage = (data) => {
            this.parent.emit('message', JSON.parse(data.data))
          }
          wsClient.onopen = () => {
            this.parent.emit('connect')
          }
          wsClient.onclose = () => {
            wsClient.close()
            this.parent.internal = null
            this.parent.emit('close')
          }
        }
      }
    }
  },
  define: {
    send (data) {
      if (this.internal && this.internal.readyState > 0 || typeof this.upstream.val !== 'string') {
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

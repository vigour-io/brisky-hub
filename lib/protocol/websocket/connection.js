'use strict'
var Connection = require('../connection')
var WsClient = require('websocket').w3cwebsocket

module.exports = new Connection({
  upstream: {
    $type: 'url',
    on: {
      data: {
        protocol (data, event) {
          var val = this.val
          if (!val) {
            return
          }
          if (data === null) {
            return
          }
          if (this.parent.internal) {
            this.parent.internal.close()
          }

          let wsClient = this.parent.internal = new WsClient(val, 'hubs')
          wsClient.onerror = (err) => {
            this.parent.emit('error', err)
          }
          wsClient.onmessage = (data) => {
            // ok so fix data right here
            this.parent.emit('message', JSON.parse(data.data))
          }
          wsClient.onopen = () => {
            this.parent.emit('connect')
          }
          // on remove wsClient.close()
          wsClient.onclose = () => {
            wsClient.close()
            this.parent.emit('close')
          }
        }
      }
    }
  },
  define: {
    send (data) {
      // should not be nessecary!
      var payload
      payload = JSON.stringify(data)
      if (this.internal) {
        this.internal.send(payload)
      }
    }
  },
  on: {
    remove: {
      protocol () {
        if (this.internal) {
          this.internal.close()
        }
      }
    }
  }
}).Constructor

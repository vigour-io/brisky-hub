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
            // console.warn('removing connection dont worry about it for now! -- add more here later')
            return
          }

          if (this.parent.internal) {
            // probably something here
            this.parent.internal.close()
          }

          let wsClient = this.parent.internal = new WsClient(val, 'hubs')
          wsClient.onerror = (err) => {
            this.parent.emit('error', err)
          }
          wsClient.onmessage = (data) => {
            console.log('bitch plzzzz xxxx', data)
            // ok so fix data right here
            this.parent.emit('message', JSON.parse(data.data))
          }
          wsClient.onopen = () => {
            console.log('open!')
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
      this.internal.send(JSON.stringify(data))
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

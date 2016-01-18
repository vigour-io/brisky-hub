'use strict'
var Connection = require('../connection')
var WsClient = require('websocket').w3cwebsocket

// var cache = {}
// clear once in a while

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
            console.log('wsClient ERROR\n', err, '\n')
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
      var payload
      payload = JSON.stringify(data)
      // console.log(this._input)
      if (this.internal) {
        this.internal.send(payload)
      } else {
        console.log('somethign wrong trying to fire send on removed client!', data, this.path)
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

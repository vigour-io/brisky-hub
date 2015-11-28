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
            // this.parent.internal.emit('close')
            // this.parent.internal._serverside.emit('close')
            // this.parent.internal.remove(event)
          }

          console.log('nigger connect')
          var wsClient = this.client = new WsClient(this.val, 'hubs')
          wsClient.onerror = (err) => {
            // this.emit('error', err)
          }
          wsClient.onmessage = (data) => {
            console.error('bitchez be real! mezzaage', data)
            // this.emit('data', data.data)
          }
          wsClient.onopen = () => {
            console.error('bitchez be real! connectz', data)
            // this.onConnect()
            // this.emit('connect')
          }
          wsClient.onclose = () => {
            // this.onDisconnect()
            // this.emit('disconnect')
            // this.reconnect()
          }

          var internal = this.parent.internal = wsClient

          // var server = serverList[this.val]
          // if (server) {
            // var serverSide
            // var internal = this.parent.internal = new Internal({
            //   on: {
            //     send (data) {
            //       serverSide.emit('message', data)
            //     }
            //   }
            // })
            // bad for mem fix this better later!
            // internal.on('message', (data) => {
            //   this.parent.emit('message', data)
            // })
            // internal.on('connect', () => {
            //   this.parent.emit('connect')
            // })
            // serverSide = internal._serverside = new Internal({
            //   on: {
            //     send (data) {
            //       internal.emit('message', data)
            //     },
            //     remove: () => {
            //       this.parent.emit('close')
            //     }
            //   }
            // })
            // setTimeout(() => {
            //   server.emit('request', serverSide)
            //   internal.emit('connect')
            // }, 10)
          // } else {
          //   console.warn('!cannot find server mock reconnect!')
          // }
        }
      }
    }
  },
  define: {
    send (data) {
      // make this to fix
      if (this.internal.readyState > 0) {
        console.log('yes!')
        this.internal.send(data)
      } else {
        // here we need queue can be put on the protocol layer
        console.log('no!', data)
        // debugger
        // this.internal.send(data)
      }
    }
  }
}).Constructor

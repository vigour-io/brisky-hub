'use strict'
var Connection = require('../connection')
var WsClient = require('websocket').w3cwebsocket
// var isNode =

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
            console.log('allready have internal dont do it now')
            return
            // this.parent.internal.emit('close')
            // this.parent.internal._serverside.emit('close')
            // this.parent.internal.remove(event)
          }

          console.log('nigger connect')
          var wsClient = new WsClient(this.val, 'hubs')
          // wsClient.onerror = (err) => { }

          wsClient.onmessage = (data) => {
            console.error('bitchez be real! mezzaage', data)
            this.parent.emit('message', JSON.parse(data.data))
          }

          wsClient.onopen = () => {
            console.error('bitchez be real! connectz', data)
            this.parent.emit('connect')
          }

          wsClient.onclose = () => {
            this.parent.emit('close')
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
      // console.log('send it out!', this.internal)
      if (this.internal.readyState > 0 || typeof this.upstream.val !== 'string' ) {
        console.log('yes!', data)
        this.internal.send(JSON.stringify(data))
      } else {
        // here we need queue can be put on the protocol layer
        console.log('no!', data)
        // debugger
        // this.internal.send(data)
      }
    }
  }
}).Constructor

'use strict'
var Connection = require('../connection')
var serverList = require('./serverlist')
var Internal = require('./internal')

module.exports = new Connection({
  reconnectTime: 10,
  upstream: {
    on: {
      data: {
        mock (data, event) {
          if (data === null) {
            console.warn('removing connection dont worry about it for now! -- add more here later')
            return
          }

          if (this.parent.internal) {
            this.parent.internal.emit('close')
            this.parent.internal._serverside.emit('close')
            this.parent.internal.remove(event)
          }

          var server = serverList[this.val]
          if (server) {
            var serverSide
            var internal = this.parent.internal = new Internal({
              on: {
                send (data) {
                  serverSide.emit('message', data)
                }
              }
            })
            // bad for mem fix this better later!
            internal.on('message', (data) => {
              this.parent.emit('message', data)
            })
            internal.on('connect', () => {
              this.parent.emit('connect')
            })
            serverSide = internal._serverside = new Internal({
              on: {
                send (data) {
                  internal.emit('message', data)
                },
                remove: () => {
                  this.parent.emit('close')
                }
              }
            })
            setTimeout(() => {
              server.emit('request', serverSide)
              internal.emit('connect')
            }, 10)
          } else {
            console.warn('!cannot find server mock reconnect!')
          }
        }
      }
    }
  },
  define: {
    send (data) {
      console.log('hey im sending!', data)
      this.internal.emit('send', data)
    }
  }
}).Constructor

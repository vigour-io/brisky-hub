'use strict'
var Connection = require('../connection')
var serverList = require('./serverlist')
var Internal = require('./internal')

module.exports = new Connection({
  upstream: {
    on: {
      data: {
        mock (data, event) {

          // if allready had data disconnect
          if (this.parent.internal) {
            console.log('allready have a connection lets dc it!')
            this.parent.internal.emit('close')
            this.parent.internal._serverside.emit('close')
            this.parent.internal.remove()
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
      this.internal.emit('send', data)
    }
  }
}).Constructor
// connection does not know shit about clients etc -- just a connection!

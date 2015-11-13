'use strict'
var Connection = require('../connection')
var serverList = require('./serverlist')
var Internal = require('./internal')

module.exports = new Connection({
  upstream: {
    on: {
      data: {
        mock (data, event) {
          console.warn('Make upstream mock connection', this.val)
          var server = serverList[this.val]
          if (server) {
            console.log('!!!found server!!!', this.val)
            // this is pure mock -- need to add connect, reconnect etc
            var serverSide
            var internal = this.parent.internal = new Internal({
              on: {
                send (data) {
                  serverSide.emit('message', data)
                }
              }
            })
            serverSide = new Internal({
              on: {
                send (data) {
                  internal.emit('message', data)
                }
              }
            })
            server.emit('request', serverSide)
            // console.log('?do it!??', this.parent.path)
            // this.parent.emit('connect')
            // this is pure mock
          } else {
            console.warn('!cannot find server mock reconnect!')
          }
        }
      }
    }
  },
  define: {
    send (data) {
      console.log('send data?', data) //some kind of batching
      this.internal.emit('send', data)
    }
  }
}).Constructor
// connection does not know shit about clients etc -- just a connection!

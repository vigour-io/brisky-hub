'use strict'
var Connection = require('../connection')
var serverList = require('./serverlist')
var Internal = require('./internal')

module.exports = new Connection({
  reconnectTime: 10,
  upstream: {
    $type: 'string',
    on: {
      data: {
        protocol (data, event) {
          if (data === null) {
            // console.warn('removing connection dont worry about it for now! -- add more here later')
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
              console.log('xxxxxxx')
              this.parent.emit('message', data)
            })
            internal.on('connect', () => {
              this.parent.emit('connect')
            })
            serverSide = internal._serverside = new Internal({
              on: {
                send (data) {
                  console.log('server-->', data)
                  internal.emit('message', data)
                },
                remove: () => {
                  this.parent.emit('close')
                }
              }
            })
            setTimeout(() => {
              server.emit('request', serverSide)
              // setTimeout(() => {
              internal.emit('connect')
              // }, 10)
            }, 10)
          } else {
            // console.warn('!cannot find server mock reconnect!')
          }
        }
      }
    }
  },
  define: {
    send (data) {
      console.log(':(')
      console.log('haha send!')
      this.mocktimer = setTimeout(() => this.internal.emit('send', data), 0)
    }
  },
  on: {
    remove: {
      protocol () {
        if (this.mocktimer) {
          clearTimeout(this.mocktimer)
        }
      }
    }
  }
}).Constructor

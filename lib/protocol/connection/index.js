'use strict'
var Observable = require('vigour-js/lib/observable')
var Client = require('../../client')

module.exports = exports = new Observable({
  properties: {
    reconnectTime: { val: 300 },
    reconnectMax: { val: 5000 },
    reconnectFactor: { val: 1.1 },
    reconnecting: true
  },
  on: {
    remove: {
      clients (data, event) {
        this._on.data.base.each(function (property, key) {
          if (property.parent instanceof Client) {
            property.parent.remove(event)
          }
        })
      }
    },
    connect: {
      reconnect () {
        if (this.reconnecting) {
          clearTimeout(this.reconnecting)
          this.reconnecting = null
        }
      }
    },
    reconnect: {
      reconnect (data, event) {
        this.reconnecting = setTimeout(() => {
          this.upstream.emit('data', this.upstream.val)
          this.emit(
            'reconnect',
            Math.min(data * this.reconnectFactor, this.reconnectMax)
          )
        }, data)
      }
    },
    close: {
      reconnect (data, event) {
        this.emit('reconnect', this.reconnectTime, event)
      }
    }
  }
}).Constructor

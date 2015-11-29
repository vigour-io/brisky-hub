'use strict'
var Observable = require('vigour-js/lib/observable')
var Client = require('../../client')
var Event = require('vigour-js/lib/event')

module.exports = exports = new Observable({
  properties: {
    internal: true,
    // refresh on ios from bg!
    reconnectTime: { val: 500 },
    reconnectMax: { val: 3000 },
    reconnectFactor: { val: 1.5 },
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
        if (!this.reconnecting) {
          this.reconnecting = setTimeout(() => {
            console.log('reconnect', data)
            // var event = new Event('')
            this.upstream.emit('data', this.upstream.val)
            this.reconnecting = null
            this.emit(
              'reconnect',
              Math.min(data * this.reconnectFactor, this.reconnectMax)
            )
          }, data)
        }
      }
    },
    close: {
      reconnect (data, event) {
        this.emit('reconnect', this.reconnectTime, event)
      }
    }
  }
}).Constructor

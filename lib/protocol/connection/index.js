'use strict'
var Observable = require('vigour-js/lib/observable')
var Client = require('../../client')
// var Event = require('vigour-js/lib/event')

module.exports = exports = new Observable({
  properties: {
    internal: true,
    reconnectTime: { val: 100 },
    reconnectMax: { val: 3000 },
    reconnectFactor: { val: 1.5 },
    reconnecting: true
  },
  upstream: {
    inject: require('vigour-js/lib/operator/type')
  },
  on: {
    remove: {
      clients (data, event) {
        if (this._on && this._on.data && this._on.data.base) {
          this._on.data.base.each(function (property, key) {
            if (property.parent instanceof Client) {
              property.parent.remove(event)
            }
          })
        }
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
            console.log('reconnect!')
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
  },
  inject: require('./push')
}).Constructor

'use strict'
var Observable = require('vigour-js/lib/observable')
var ua = require('vigour-ua')
var isNode = require('vigour-js/lib/util/is/node')
module.exports = new Observable({
  useVal: true,
  define: {
    connections: {
      value: {}
    }
  },
  properties: {
    Connection: true
  },
  on: {
    value: {
      connect (data, event) {
        if (!this.hasOwnProperty('client')) {
          let id = this.lookUp('id')
          let hub = this.parent.parent
          let set = { val: id }
          if (isNode) {
            set.platform = 'node'
          } else {
            ua(window.navigator.userAgent, set)
          }
          hub.set({ clients: { [id]: set } })
          this.set({ client: hub.clients[id] })
          let connection = new this.Connection({
            type: 'up'
          })
          this.connections[connection.uid] = connection
        } else {
          console.log('allready have client its only a switch!')
        }
        this.emit('connect', data, event)
      }
    }
  }
}).Constructor

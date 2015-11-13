'use strict'
var Observable = require('vigour-js/lib/observable')
var ua = require('vigour-ua')
var isNode = require('vigour-js/lib/util/is/node')
module.exports = new Observable({
  useVal: true,
  properties: {
    Connection: true,
    connections: true,
    internal: true
  },
  on: {
    value: {
      upstream (data, event) {
        if (!this.hasOwnProperty('client')) {
          let hub = this.parent.parent
          let id = this.lookUp('id')
          let set = { val: id }
          if (isNode) {
            set.platform = 'node'
          } else {
            ua(window.navigator.userAgent, set)
          }
          // need to communicate this figure out the best spot later when connections is not used immediatly
          hub.set({ clients: { [id]: set } }, false)
          let client = hub.clients[id]
          this.set({ client: client }, false)
          if (!this.connections[id]) {
            this.connections[id] = new this.Connection({ upstream: this })
          }
          client.set({
            connection: this.connections[id]
          }, false)
          client.connection.origin.send({ client: client.serialize(), stamp: event.stamp })
        } else {
          console.log('allready have client its only a switch! -- connection should listen!')
        }
        this.emit('connect', data, event)
      }
    }
  }
}).Constructor

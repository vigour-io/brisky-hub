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
  connected: {},
  on: {
    value: {
      upstream (data, event) {
        if (!this.hasOwnProperty('client')) {
          let upstream = this.val
          if (!upstream) {
            this.emit('error', 'no upstream')
            return
          }

          let hub = this.parent.parent
          let adapter = this.parent
          let id = this.lookUp('id')
          let set = { val: id }
          let connection
          let protocol = this

          if (isNode) {
            set.platform = 'node'
          } else {
            ua(window.navigator.userAgent, set)
          }

          hub.set({ clients: { [id]: set } }, false)
          let client = hub.clients[id]
          this.set({ client: client }, false)
          if (!this.connections) {
            this.connections = {}
          }

          if (!this.connections[upstream]) {
            this.connections[upstream] = connection = new this.Connection({ upstream: this })
          } else {
            connection = this.connections[upstream]
          }

          client.set({ connection: connection }, false)

          connection
            .on('message', function (data) {
              adapter.receive(data, 'upstream')
            })
            .on('close', function (data, event) {
              protocol.connected.val = false
              protocol.emit('close', data, event)
            })
            .on('reconnect', function (data, event) {
              protocol.emit('reconnect', data, event)
            })
            .on('connect', function (data, event) {
              // set protocol .connected
              protocol.connected.val = true
              let payload = {
                client: client.serialize(),
                stamp: event.stamp
              }
              if (typeof adapter.scope.val === 'string') { //add number as well!
                payload.scope = adapter.scope.val
              }
              this.send(payload)
              protocol.emit('connect', data, event)
            })
        } else {
          console.warn('allready have client this is only a switch', this.path)
        }
      }
    }
  }
}).Constructor

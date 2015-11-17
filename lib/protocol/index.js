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
          // need to communicate this figure out the best spot later when connections is not used immediatly
          hub.set({ clients: { [id]: set } }, false)
          let client = hub.clients[id]
          this.set({ client: client }, false)
          if (!this.connections[id]) {
            this.connections[id] = connection = new this.Connection({ upstream: this })
          }

          client.set({
            connection: connection
          }, false)

          connection.on('message', function (data) {
            adapter.receive(data, 'upstream')
          })

          connection.on('close', function (data, event) {
            protocol.emit('close', data, event)
            // rety queue
          })

          connection.on('connect', function (data, event) {
            let payload = {
              client: client.serialize(),
              stamp: event.stamp
            }
            if (adapter.scope) {
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

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

          // make it easier to chain base events -- just by default send eveyrhting to the reffed guy (make expections ofc)
          connection.on('message', function (data) {
            adapter.receive(data, 'upstream')
          })

          // later ill manage this by queue
          // this should be send when connected
          connection.on('connect', function (data, event) {
            let payload = {
              client: client.serialize(),
              stamp: event.stamp
            }
            // put clients in scopes as well
            // this is the wrong location!
            if (adapter.scope) {
              payload.scope = adapter.scope.val
            }
            this.send(payload)
            protocol.emit('connect', data, event)
          })
        } else {
          console.log('allready have client its only a switch! -- connection should listen!')
        }
      }
    }
  }
}).Constructor

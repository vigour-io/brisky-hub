'use strict'
var Observable = require('vigour-js/lib/observable')
var ua = require('vigour-ua')
var isNode = require('vigour-js/lib/util/is/node')
var is = require('vigour-js/lib/observable/is')

module.exports = new Observable({
  useVal: true,
  properties: {
    Connection: true,
    ServerConnection: true,
    connections: true,
    internal: true
  },
  connected: {
    val: false,
    inject: is
  },
  reconnecting: {
    val: false,
    inject: is
  },
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
          // not good for cleaning up make these attach listeners (so they get removed when you remove the protoicol)
          connection
            .on('message', (data) => {
              adapter.receive(data, 'upstream')
            })
            .on('close', (data, event) => {
              this.connected.val = false

              // console.log( this.parent.parent.clients )
              this.parent.parent.clients.each((client, key) => {
                if (key !== id && client.remove) {
                  client.remove()
                }
              })
              // this.parent.parent.clients.clear()

              this.emit('close', data, event)
            })
            .on('reconnect', (data, event) => {
              this.reconnecting.val = true
              this.emit('reconnect', data, event)
            })
            .on('connect', function (data, event) {
              protocol.reconnecting.val = false
              protocol.connected.val = true
              var payload = {
                client: client.serialize(),
                stamp: event.stamp
              }

              if (client.subscriptions) {
                // console.log(client.subscriptions)
                payload.client.subscriptions = client.subscriptions
              }

              if (adapter.scope.val) {
                payload.scope = adapter.scope.val
              }
              this.push(payload)
              // push
              // this.send(payload)
              protocol.emit('connect', data, event)
            })
        } else {
          // console.warn('allready have client this is only a switch', this.path)
          // be extra carefull here when trying to do scope fixes!
        }
      }
    }
  }
}).Constructor

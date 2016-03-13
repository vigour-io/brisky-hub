'use strict'
var Observable = require('vigour-observable')
var ua = require('vigour-ua')
var isNode = require('vigour-util/is/node')
var is = require('vigour-observable/lib/observable/is') // use vigour-is!

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
          // this.set()
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

          // this goes rly wrong with context...

          connection
            .on('message', (data) => {
              adapter.receive(data, 'upstream')
            })
            .on('close', (data, event) => {
              this.connected.val = false
              this.parent.parent.clients.each((client, key) => {
                if (key !== id && client.remove) {
                  // only for scopes
                  // then fix ips as well!
                  // ** TODO *** needs cleanup !!! may need event?
                  client.remove()
                }
              })
              this.emit('close', data, event)
            })
            .on('reconnect', (data, event) => {
              this.reconnecting.val = true
              this.emit('reconnect', data, event)
            })
            .on('connect', function (data, event) {

              // pretty wrong and dirty
              if (protocol._context) {
                protocol.clearContext()
                // throw new Error('protocol has context should never happen ')
              }

              protocol.connected.set(true)
              protocol.reconnecting.val = false

              var payload = {
                client: client.serialize(),
                stamp: event.stamp
              }

              if (client.subscriptions) {
                payload.client.subscriptions = client.subscriptions
              }

              if (adapter.scope.val) {
                payload.scope = adapter.scope.val
              }
              this.push(payload)
              // push
              // this.send(payload)
              // console.log('connect!', protocol.parent.id)
              protocol.emit('connect', data, event)
            })
            .on('error', (err) => {
              this.parent.emit('error', err)
            })
        } else {
          // console.warn('allready have client this is only a switch', this.path)
          // be extra carefull here when trying to do scope fixes!
        }
      }
    }
  }
}).Constructor

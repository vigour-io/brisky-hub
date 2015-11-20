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
        console.log('im setting upstream!'.rainbow)
        // switching scopes is perhaps what goes wrong?

        if (!this.hasOwnProperty('client')) {
          console.log('-------->', this._path)
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

          // console.log('ok!', upstream)
          // multiple in a bit
          // that means multiple clients per single connetion! hard thing todo!
          // so thats different then this -- we want to store a conneciton map where we store the upstream!
          // not the id thats not relevant it pure the val of the current upstream
          if (!this.connections) {
            // so this should be ok now!
            this.connections = {}
          }

          if (!this.connections[upstream]) {
            this.connections[upstream] = connection = new this.Connection({ upstream: this })
          } else {
            // should not have this connection totaly wrong!
            console.log('i got the connection!'.rainbow, upstream.blue, this.path.join('.').blue)
            connection = this.connections[upstream]
          }

          client.set({ connection: connection }, false)

          connection
            .on('message', function (data) {
              adapter.receive(data, 'upstream')
            })
            .on('close', function (data, event) {
              protocol.emit('close', data, event)
            })
            .on('reconnect', function (data, event) {
              protocol.emit('reconnect', data, event)
            })
            .on('connect', function (data, event) {
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

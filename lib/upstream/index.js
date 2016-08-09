'use strict'
const vstamp = require('vigour-stamp')
const client = require('../client/upstream')
const send = require('./send')
const connect = require('./connect')
const queue = require('./queue')

exports.properties = {
  upstream: true,
  reconnect: true,
  queue: true,
  url: {
    sync: false,
    on: {
      data: {
        connect (data, stamp) {
          const hub = this.cParent()
          const val = this.compute()
          if (hub.upstream) {
            /*
              console.log('yo')
              console.log(vstamp.offset)
              console.log(vstamp)
            */
            if (hub.reconnect) {
              clearTimeout(hub.reconnect)
              hub.reconnect = null
            }
            hub.upstream.blockReconnect = true
            hub.upstream.close()
          }
          hub.set({ connected: false }, stamp)
          if (val) { connect(hub, val, 50) }
        }
      }
    }
  },
  connected: {
    sync: false,
    on: {
      data: {
        clients (val, stamp) {
          const hub = this.cParent()
          if (this.compute() === false && hub.upstream) {
            const clients = hub.clients
            if (clients && clients.keys().length > 1) {
              clients.each((client) => {
                if (
                  client.val !== null &&
                  !client.socket &&
                  client.key != hub.id // eslint-disable-line
                ) {
                  client.remove(stamp)
                }
              })
            }
          }
        },
        queue (val, stamp) {
          const hub = this.cParent()
          if (this.compute() === true && hub.upstream) {
            client(hub, stamp)
            send(hub)
          }
        }
      }
    }
  }
}

exports.define = {
  sendUp (state, val, stamp) {
    if (val !== void 0) {
      if (!this.connected || !this.connected.compute()) {
        queue(this, state, val, stamp, vstamp.offset)
      } else {
        const create = queue(this, state, val, stamp)
        if (create) {
          vstamp.on(stamp, () => send(this))
        }
      }
    }
  }
}


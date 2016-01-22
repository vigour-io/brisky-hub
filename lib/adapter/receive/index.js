'use strict'
var Event = require('vigour-js/lib/event')
var util = require('../../util')
var seperator = util.seperator
var isNetworkStamp = util.isNetworkStamp
// var callbacks = require('../syncable/on/subscribe/callback')
// var timeout
exports.inject = require('./subscription')
exports.define = {
  receive (data, connection) {
    if (!data) {
      this.emit('error', 'no data to parse')
      return
    }

    if (!connection) {
      this.emit('error', 'no connection')
      return
    }
    let stamp = data.stamp
    if (!stamp) {
      console.log('💩 error: no stamp passed to receive')
      return
    }

    let isString = typeof stamp === 'string'
    if (
      isString &&
      this.isOrigin(data.stamp)
    ) {
      this.emit('error', 'recieved own event ' + stamp)
      return
    }

    console.warn(
      '\n ⬇️   ' + data.stamp
      // '\n', JSON.stringify(data, false, 2)
    )

    let hub = this._parent
    let event = new Event('data', stamp)
    let scope = data.scope
    let id
    if (connection === 'upstream') {
      event.upstream = true
    } else {
      if (data.client) {
        id = data.client.val
        if (!isString || !isNetworkStamp(stamp)) {
          // why not allway do this?
          event.stamp = id + seperator + stamp
        }
        data = this.swtichScope(data, event)
        if (!id) {
          event.remove()
          this.emit('error', 'client without id tries to connect')
          return
        }

        let subs = data.client.subscriptions
        if (subs) {
          delete data.client.subscriptions
        }

        if (!data.client.connection) {
          data.client.connection = connection
        }
        if (scope) {
          hub = hub.getScope(scope)
        }
        hub.set({ clients: { [id]: data.client } }, event)

        if (subs) {
          // lets also do $ --- one walker for it?
          hub.adapter.receiveSubscriptions(hub, subs, id, event)
        }

        if (connection.ip) {
          hub.clients[id].set({ ip: connection.ip })
        }
      } else if (connection) {
        if (scope) {
          hub = hub.getScope(scope, event)
        }
      } else {
        event.remove()
        this.emit('error', 'connection without client')
        return
      }
    }

    if (data.subscriptions) {
      // need to call hub.adapter for scopes
      hub.adapter.receiveSubscriptionResults(hub, data.subscriptions, data, id, event)
    }

    if (data.set) {
      hub.set(data.set, event)
    }

    event.trigger()
  }
}

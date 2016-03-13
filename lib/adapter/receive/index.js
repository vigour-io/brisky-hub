'use strict'
var Event = require('vigour-event')
var util = require('../../util')
var seperator = util.seperator
var isNetworkStamp = util.isNetworkStamp
// create a special hub error

exports.define = {
  receive (data, connection) {
    if (typeof data !== 'object' || !data) {
      this.emit('error', 'receive: 💩  wrong or no data to parse')
      return
    }

    if (!connection) {
      this.emit('error', 'receive: 💩  no connection')
      return
    }

    let stamp = data.stamp

    if (!stamp) {
      this.emit('error', 'receive: 💩  no stamp passed to receive')
      return
    }

    let isString = typeof stamp === 'string'
    if (
      isString &&
      this.isOrigin(data.stamp)
    ) {
      this.emit('error', 'receive: 💩  recieved own event ' + stamp)
      return
    }

    let hub = this._parent
    let event = new Event('data', stamp)
    let scope = data.scope
    let id
    if (connection === 'upstream') {
      event.upstream = true
    } else {
      if (data.client) {
        id = data.client.val
        if (!id) {
          event.remove()
          this.emit('error', 'receive: 💩  client without id is trying to connect')
          return
        }
        if (!isString || !isNetworkStamp(stamp)) {
          // why not allway do this -- never on the client
          event.stamp = id + seperator + stamp
        }
        data = this.swtichScope(data, event)

        if (!data.client.connection) {
          data.client.connection = connection
        }
        if (scope) {
          hub = hub.getScope(scope)
        }
        hub.set({ clients: { [id]: data.client } }, event)

        if (connection.ip) {
          hub.clients[id].set({ ip: connection.ip })
        }
      } else if (connection) {
        if (scope) {
          hub = hub.getScope(scope, event)
        }
      } else {
        event.remove()
        this.emit('error', 'receive: 💩  connection without client')
        return
      }
    }

    if (data.set) {
      // type checks
      hub.set(data.set, event)
    }

    event.trigger()
  }
}

'use strict'
var Event = require('vigour-js/lib/event')
var isNumberLike = require('vigour-js/lib/util/is/numberlike')
exports.define = {
  parse (data, connection) {
    // this needs a lot of re-work it pretty crappy now!
    // connection will be handeled totatly different
    if (!data) {
      this.emit('error', 'no data to parse')
      return
    }
    if (!connection) {
      this.emit('error', 'no connection')
      return
    }
    if (data.stamp.indexOf && data.stamp.indexOf(this.id === 0)) {
      this.emit('error', 'recieved own event ' + event.stamp)
      return
    }
    let hub = this._parent
    let event = new Event(hub, 'data', data.stamp)
    let scope = data.scope
    let id
    event.isTriggered = true
    if (connection === 'upstream') { // do this differently maybe?
      event.upstream = true
    } else {
      if (data.client) {
        id = data.client.val
        if (!id) {
          event.clear()
          this.emit('error', 'client without id tries to connect')
          return
        }
        event.stamp = id + '-' + data.stamp
        data.client.connection = connection
        if (scope) {
          data.client.scope = scope
          hub = hub.scopes(scope, event)
        }
        hub.set({ clients: { [id]: data.client } }, event)
        // connection.client = event.client = hub.clients[id]
      } else if (connection.client) {
        if (!scope && connection.client.scope) {
          // connection is always part of client so i can use connection.parent
          scope = connection.parent.scope
        }
        if (scope) {
          hub = hub.scopes(scope, event)
        }
        if (isNumberLike(data.stamp)) {
          id = connection.client.val
          event.stamp = id + '-' + data.stamp
        }
        event.client = connection.client
      } else {
        event.clear()
        this.emit('error', 'connection without client')
        return
      }
    }
    if (data.set) {
      hub.set(data.set, event)
    }
    event.trigger()
  }
}

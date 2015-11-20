'use strict'
var Event = require('vigour-js/lib/event')
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
    if (data.stamp.indexOf && data.stamp.indexOf(this.id) === 0) {
      this.emit('error', 'recieved own event ' + event.stamp)
      return
    }
    let hub = this._parent
    let event = new Event(hub, 'data', data.stamp)
    let scope = data.scope
    let id
    event.isTriggered = true
    if (connection === 'upstream') {
      event.upstream = true
    } else {
      // reconnecting to different scopes?
      if (data.client) {
        id = data.client.val
        if (!id) {
          event.remove()
          this.emit('error', 'client without id tries to connect')
          return
        }
        event.stamp = id + '-' + data.stamp
        data.client.connection = connection
        if (scope) {
          hub = hub.getScope(scope)
        }
        hub.set({ clients: { [id]: data.client } }, event)
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
    if (data.set) {
      hub.set(data.set, event)
    }
    event.trigger()
  }
}

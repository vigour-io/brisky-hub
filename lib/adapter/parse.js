'use strict'
var Event = require('vigour-js/lib/event')
var isNumberLike = require('vigour-js/lib/util/is/numberlike')
exports.define = {
  parse (data, connection) {

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
      // lets do all this management and connection stuff more upwards and not here!
      if (data.client) {
        id = data.client.val
        event.stamp = id + '-' + data.stamp
        if (id) {
          data.client.connection = connection
          if (scope) {
            data.client.scope = scope
            hub = hub.scopes(scope, event)
          }
          // set correct scope as well
          hub.set({ clients: { [id]: data.client } }, event)
          connection.client = event.client = hub.clients[id]
        }
      } else if (connection.client) {
        // this part takes care of setting the correct stamps
        if (isNumberLike(data.stamp)) {
          id = connection.client.val
          event.stamp = id + '-' + data.stamp
        }
        event.client = connection.client
      } else {
        this.emit('error', 'connection without client')
        return
      }
    }

    if (!scope && connection.client.scope) {
      scope = connection.client.scope
    }

    // set (move to seperate method maybe?)
    if (data.set) {
      if (scope) {
        hub.scopes(scope, event).set(data.set, event)
      } else {
        hub.set(data.set, event)
      }
    }
    event.trigger()
  }
}

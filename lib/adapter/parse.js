'use strict'
var Event = require('vigour-js/lib/event')
var uuidGlob = require('vigour-js/lib/util/uuid')
var isNumberLike = require('vigour-js/lib/util/is/numberlike')
var isNode = require('vigour-js/lib/util/is/node')

exports.define = {
  parse (data, connection) {
    if (!data) {
      this.emit('error', 'no data to parse')
      return
    }
    let hub = this._parent
    let event = new Event(hub, 'data', data.stamp)
    let uuid
    let createdClient
    let scope = data.scope
    event.isTriggered = true
    if (!connection) {
      this.emit('error', 'no connection')
      return
    } else if (connection === 'upstream') {
      event.upstream = true
    } else {
      if (data.client) {
        createdClient = true
        uuid = data.client.val
        event.stamp = uuid + '-' + data.stamp
        if (uuid) {
          data.client.connection = connection
          if (data.scope) {
            data.client.scope = scope = data.scope
            hub.scopes(scope, event)
          }
          hub.set({ clients: { [uuid]: data.client } }, event)


          console.log(connection)

          // this is weird!
          connection.client = event.client = hub.clients[uuid]
          // console.log(connection.remoteAddress)

        }
      } else if (connection.client) {
        if (isNumberLike(data.stamp)) {
          uuid = connection.client.val
          event.stamp = uuid + '-' + data.stamp
        }
        event.client = connection.client
        if (!scope && connection.client.scope) {
          scope = connection.client.scope
        }
      } else {
        this.emit('error', 'connection without client')
        return
      }
    }
    if (data.stamp.indexOf && data.stamp.indexOf(uuidGlob.val) === 0) {
      this.emit('error', 'recieved own event ' + event.stamp)
      return
    }
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

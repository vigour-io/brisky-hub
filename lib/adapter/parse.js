'use strict'
var Event = require('vigour-js/lib/event')
var uuidGlob = require('vigour-js/lib/util/uuid')
var isNumberLike = require('vigour-js/lib/util/is/numberlike')

exports.define = {
  parse (data, connection) {
    if (!data) {
      this.emit('error', 'no data to parse')
      return
    }
    let hub = this._parent
    let event = new Event(hub, 'data', data.stamp)
    let uuid
    let scope = data.scope
    let createdClient
    event.isTriggered = true
    if (!connection) {
      this.emit('error', 'no connection')
      return
    } else if (connection === 'upstream') {
      event.upstream = true
    } else {
      if (data.client) {
        uuid = data.client.val
        event.stamp = uuid + '-' + data.stamp
        if (uuid) {
          data.client.connection = connection
          if (data.scope) {
            data.client.scope = scope = data.scope
            hub.scopes(scope, event)
          }
          hub.set({ clients: { [uuid]: data.client } }, event)
          connection.client = event.client = hub.clients[uuid]
        }
        createdClient = connection.client
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
    // if (createdClient) {
      // console.log('send client ip!'.rainbow, connection.remoteAddress)
      // createdClient.set({ ip: 'haha' })
    // }
  }
}

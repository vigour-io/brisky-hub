'use strict'
var Event = require('vjs/lib/event')
var uuidGlob = require('vjs/lib/util/uuid')
var isNumberLike = require('vjs/lib/util/is/numberlike')

exports.define = {
  parse (data, connection) {
    if (!data) {
      this.emit('error', 'no data to parse')
      return
    }
    let hub = this._parent
    let event = new Event(hub, 'data', data.stamp)
    let uuid
    let scope = data.instance
    event.isTriggered = true

    // check for instance for dynamic switching!
    // set on instance from a client
    if (!connection) {
      this.emit('error', 'no connection')
      return
    } else if (connection === 'upstream') {
      // can also have instance
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
          // make connection a type as well (conneciton send / receive or something)
        }
      } else if (connection.client) {
        // YEP
        // changing connections etc
        if (isNumberLike(data.stamp)) {
          uuid = connection.client.val
          event.stamp = uuid + '-' + data.stamp
        }
        event.client = connection.client
        if (!scope) {
          hub.scopes(scope, event) // this is still dirty
          scope = connection.client.scope
        }
        // connection.client.lastStamp = event.stamp
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
      // console.log('HEY INCOMING!', instance, connection && connection.client && connection.client.val)
      if (scope) {
        console.log('ok?', scope)
        hub.scopes(scope, event).set(data.set, event)
      } else {
        // why does this not clear everything
        // hub.clearContext()
        // YEP
        hub.set(data.set, event)
      }
    }
    event.trigger()
  }
}

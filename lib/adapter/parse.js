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
    let hub = this.parent
    let event = new Event(hub, 'data', data.stamp)
    let uuid
    // event.isTriggered = true

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
          hub.set({ clients: { [uuid]: data.client } }, event)
          connection.client = event.client = hub.clients[uuid]
          // make connection a type as well (conneciton send / receive or something)
        }
      } else if (connection.client) {
        // changing connections etc
        if (isNumberLike(data.stamp)) {
          uuid = connection.client.val
          event.stamp = uuid + '-' + data.stamp
        }
        event.client = connection.client
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
      hub.set(data.set, event)
    }

    event.trigger()
  }
}

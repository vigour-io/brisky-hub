'use strict'
var Event = require('vjs/lib/event')
var uuidGlob = require('vjs/lib/util/uuid')
var isNumberLike = require('vjs/lib/util/is/numberlike')

function info (adapter) {
  return adapter.path.join('.') + '.parse: '
}

exports.define = {
  parse (data, connection) {
    if (!data) {
      this.emit('error', new Error(info(this) + 'no data to parse'))
      return
    }
    let hub = this.parent
    let event = new Event(hub, 'data', data.stamp)
    let uuid
    event.isTriggered = true

    if (!connection) {
      this.emit('error', new Error(info(this) + 'no connection'))
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
        this.emit('error', new Error(info(this) + 'connection without client'))
        return
      }
    }

    if (data.stamp.indexOf && data.stamp.indexOf(uuidGlob.val) === 0) {
      this.emit('error', new Error(info(this) + 'recieved own event ' + event.stamp))
      return
    }

    if (data.set) {
      hub.set(data.set, event)
    }

    event.trigger()
  }
}

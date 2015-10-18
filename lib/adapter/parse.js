'use strict'
var Event = require('vjs/lib/event')
var uuidGlob = require('vjs/lib/util/uuid')

exports.define = {
  parse (data, connection) {
    // pass stamp option
    if (!data) {
      this.emit('error', new Error('no data to parse'))
      return
    }

    let hub = this.parent
    let event = new Event(hub, 'data', data.stamp)
    let uuid

    if (connection === 'upstream') {
      event.upstream = true
    } else {
      if (data.client) {
        uuid = data.client.val
        event.stamp = uuid + '-' + data.stamp
        if (uuid) {
          data.client.connection = connection
          hub.set({ clients: { [uuid]: data.client } }, event)
          // make connection a type as well (conneciton send / receive or something)
          connection.client = hub.clients[uuid]
        }
      } else if (connection && connection.client) {
        // console.log('!!!!parse it!', data.stamp)
        if(typeof data.stamp === 'string') {
          // console.log(data.stamp)
        } else {
          uuid = connection.client.val
          event.stamp = uuid + '-' + data.stamp
        }
        connection.client.lastStamp = event.stamp
      } else {
        this.emit('error', new Error('cannot find client connection: ' + this.path))
      }
      // console.log('    client-event:'.blue, data.stamp)
    }

    if (data.stamp.indexOf && data.stamp.indexOf(uuidGlob.val) === 0) {
      console.log('!!!should never recieve its own event!'.red,
        event.upstream ? 'upstream'.green : '',
        'stamp:', event.stamp,
        'data:', JSON.stringify(data, false, 2)
      )
      // event.dirty = true
      // return
    }

    if (data.set) {
      hub.set(data.set, event)
    }

    event.isTriggered = true
    event.trigger()

  }
}

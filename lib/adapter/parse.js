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
    event.isTriggered = true

    if (connection === 'upstream') {
      event.upstream = true
    } else {
      if (data.client) {
        uuid = data.client.val
        event.stamp = uuid + '-' + data.stamp
        if (uuid) {
          data.client.connection = connection
          hub.set({ clients: { [uuid]: data.client } }, event)
          let client = hub.clients[uuid]
          connection.client = client
          event.client = client
          // make connection a type as well (conneciton send / receive or something)
        }
      } else if (connection && connection.client) {
        // changing connections etc
        // console.log('!!!!parse it!', data.stamp)
        if (typeof data.stamp === 'string') {
          // console.log(data.stamp)
        } else {
          uuid = connection.client.val
          event.stamp = uuid + '-' + data.stamp
        }
        event.client = connection.client
        // connection.client.lastStamp = event.stamp
      } else {
        console.error('cannot find!'.red.inverse)
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
      console.log('lets set!'.magenta, event.stamp, data.set)
      hub.set(data.set, event)
    }
    event.trigger()
  }
}

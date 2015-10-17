'use strict'
var Event = require('vjs/lib/event')

exports.define = {
  parse (data, connection) {
    // pass stamp option
    let event = new Event(hub, 'data')
    event.stamp = data.stamp
    if (connection === 'upstream') {
      event.upstream = true // (what about upstream one and 2?, add uuid)
      console.log('    upstream-event:', data.stamp)
    } else {
      console.log('    client-event:'.blue, data.stamp)
    }

    var hub = this.parent
    if (data.client) {
      // console.log('create client!')
      // also use hub uuid for this
      let uuid = data.client.val
      if (uuid) {
        data.client.connection = connection
        hub.set({ clients: { [uuid]: data.client } }, event)
        // make connection a type as well (conneciton send / receive or something)
        connection.client = hub.clients[uuid]
      }
    } else if (data.set) {
      hub.set(data.set, event)
    }
    event.isTriggered = true
    event.trigger()
  }
}

'use strict'
var Event = require('vjs/lib/event')

exports.define = {
  parse (data, connection) {
    var hub = this.parent
    if (data.client) {
      let id = data.client.val
      if (id) {
        let event = new Event(hub, 'client')
        event.id = id
        data.client.connection = connection
        hub.set({ clients: { [id]: data.client } }, event)
        // make connection a type as well (conneciton send / receive or something)
        connection.client = hub.clients[id]
        hub.emit('client', id, event)
      }
    } else if (data.set) {
      hub.set(data.set)
    }
  }
}

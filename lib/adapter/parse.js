'use strict'
exports.define = {
  parse (data, connection) {
    if (data.client) {
      let hub = this.parent
      let id = data.client.val
      if (id) {
        hub.set({ clients: { [id]: data.client } })
        // make connection a type as well (conneciton send / receive or something)
        hub.clients[id].connection = connection
        connection.client = hub.clients[id]
      }
    }
  }
}

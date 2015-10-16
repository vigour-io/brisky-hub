'use strict'
exports.define = {
  parse (data, connection) {
    console.log('receive incoming message', data)
    if (data.$client) {
      let hub = this.parent
      let id = data.$client.id
      if (id) {
        hub.set({ clients: { [id]: this.client } })
        //make connection a type as well (conneciton send / receive or something)
        hub.clients[id].connection = connection
      }
    }
  }
}

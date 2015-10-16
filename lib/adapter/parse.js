'use strict'
exports.define = {
  parse (data, connection) {
    console.log('---------------------------')
    console.log('parse incoming data', data)
    if (data.client) {
      console.log('parse data.client')
      let hub = this.parent
      let id = data.client.val
      if (id) {
        console.log('set client id', id)
        hub.set({ clients: { [id]: data.client } })
        // make connection a type as well (conneciton send / receive or something)
        hub.clients[id].connection = connection
        connection.client = hub.clients[id]
      }
    }
    console.log('---------------------------')
  }
}

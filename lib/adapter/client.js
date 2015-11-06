'use strict'
var uuid = require('vigour-js/lib/util/uuid').val
exports.properties = {
  client: require('../client')
}

exports.define = {
  getClient (event, connection) {
    // this is still a bit dirty
    if (!this.client || !this.hasOwnProperty('client')) {
      let hub = this.parent
      let id = uuid
      this.set({ client: id }, event, true)
      hub.set({ clients: { [id]: this.client } }, event)
      this.client.connection = connection
    }
    return this.client
  }
}

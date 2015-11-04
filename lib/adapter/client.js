'use strict'
var uuid = require('vigour-js/lib/util/uuid').val
// add ua to this as well! -- ua seperate npm module (parse all info imediatly, can be node whatever)

exports.properties = {
  client: require('../client')
}

exports.define = {
  getClient (event, connection) {
    if (!this.client) {
      let hub = this.parent
      let id = uuid
      this.set({ client: id }, event, true)
      hub.set({ clients: { [id]: this.client } }, event)
      this.client.connection = connection
    }
    return this.client
  }
}

'use strict'
var uuid = require('vjs/lib/util/uuid').val
// add ua to this as well! -- ua seperate npm module (parse all info imediatly, can be node whatever)

exports.properties = {
  client: require('../client')
}

exports.define = {
  getClient (event, connection) {
    if (!this.client) {
      let hub = this.parent
      let id = uuid
      // needs to set abstract connection field (immediatly, connection holds queues)
      this.set({ client: id }, event, true)
      hub.set({ clients: { [id]: this.client } }, event)
    }
    return this.client
  }
}

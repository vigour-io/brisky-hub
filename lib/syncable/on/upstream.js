'use strict'
var Protocol = require('../../protocol')
exports.on = {
  data: {
    adapter (data, event) {
      if (data === void 0 || event.type === 'level') {
        return
      }
      if ((this._input !== void 0 || data === null)) {
        this.sendUpstream(data, event)
      }
    }
  }
}

exports.define = {
  sendUpstream (data, event) {
          console.log('lets send!')

    var adapter = this.getAdapter()
    if (!adapter) {
      return
    }
    let eventorigin = this.parseEvent(event, adapter)
    if (!eventorigin) {
      return
    }
    if (!event.upstream) {
      adapter.each(
        (property) => property.client.origin.send(this, adapter.parent, data, event),
        (property) => (property instanceof Protocol) && property._input && property.client
      )
    }
  }
}

// sync all
// this is the send to all clients function -- will be optional (subscription is whats nessecary)
// if (adapter.parent.clients) {
//   adapter.parent.clients.each((client, key) => {
//     if (key !== eventorigin &&
//       client.connection &&
//       client !== event.client &&
//       (client.connection && client.connection.origin.upstream && !client.connection.origin.upstream._input) // up or down
//     ) {
//       client.send(this, adapter.parent, data, event)
//     }
//   })
// }

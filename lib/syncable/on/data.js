'use strict'

exports.on = {
  data: {
    adapter (data, event) {
      if (data === void 0) {
        return
      }

      if (this._input !== null || data === null) {
        this.sendUpstream(data, event)
      }
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

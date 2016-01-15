'use strict'
var Protocol = require('../../protocol')
var isNode = require('vigour-js/lib/util/is/node')
exports.on = {
  data: {
    adapter (data, event) {
      // this does not fire for ref now...
      // console.log('godammnit data?!!!', data, this.path, event)
      if (data === void 0 || event.type === 'level') {
        return
      }
      // console.log('----> data listener fires'.blue,
      // data && data.remove ? 'Observable[ ' + data.path.join('.') + ' ]' : data, this.syncPath)
      // any any any -- empty objects -- problem maybe
      // how to do parse better --- parse has to send empty objects as well...
      if (this._input !== void 0 || data === null) {
        this.sendUpstream(data, event)
      }
    }
  }
}

exports.define = {
  sendUpstream (data, event) {
    var adapter = this.getAdapter()
    if (!adapter) {
      return
    }
    let eventorigin = this.parseEvent(event, adapter)
    if (!eventorigin) {
      return
    }
    if (!event.upstream) {
      if (!isNode) {
        console.warn('godammnit data? send upstream!!!', data, this.path, event)
      }
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

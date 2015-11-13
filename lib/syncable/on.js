'use strict'
var Protocol = require('../protocol')

exports.on = {
  data: {
    adapter (data, event) {
      var adapter
      var parent = this
      while (!adapter && parent) {
        adapter = parent.adapter
        if (!adapter) {
          parent = parent.parent
        }
      }

      if (!adapter) {
        this.emit('error', 'no adapter yet')
        return
      }

      let id = adapter.id
      let eventorigin = (
          event.stamp.indexOf &&
          event.stamp.indexOf('-') &&
          event.stamp.slice(0, event.stamp.indexOf('-'))
        ) || id

      if (!event.upstream) { // sync to other upstreams??? may be confusing
        adapter.each(
          (property) => property.client.origin.send(this, adapter.parent, data, event, eventorigin),
          (property) => (property instanceof Protocol) && property._input && property.client
        )
      }

      // this is the send to all clients function -- will be optional (subscription is whats nessecary)
      // if (adapter.parent.clients) {
      //   adapter.parent.clients.each((client, key) => {
      //     client = client.origin
      //     if (key !== eventorigin &&
      //       client !== event.client &&
      //       (!adapaterClient || client !== adapaterClient)
      //     ) {
      //       client.send(this, adapter.parent, data, event)
      //     }
      //   })
      // }
    }
  }
}

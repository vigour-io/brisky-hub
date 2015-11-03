'use strict'
var uuid = require('vjs/lib/util/uuid').val

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

      let adapaterClient = adapter.client
      let eventorigin = (
          event.stamp.indexOf &&
          event.stamp.indexOf('-') &&
          event.stamp.slice(0, event.stamp.indexOf('-'))
        ) || uuid

      if (adapaterClient && !event.upstream) {
        console.log('---------------')
        console.log('send to upwards'.cyan,
          '\n  stamp:', event.stamp,
          '\n  adapter:', adapter.val
          // '\n  data:', data
        )
        adapaterClient.send(this, adapter.parent, data, event, eventorigin)
        console.log('---------------\n\n\n')
      }

      // this is the send to all clients function -- will be optional (subscription is whats nessecary)
      if (adapter.parent.clients) {
        adapter.parent.clients.each((client, key) => {
          client = client.origin
          if (key !== eventorigin &&
            client !== event.client &&
            (!adapaterClient || client !== adapaterClient)
          ) {
            client.send(this, adapter.parent, data, event)
          }
        })
      }
    }
  }
}

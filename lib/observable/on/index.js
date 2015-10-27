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
        parent.emit('error', 'no adapter yet')
        return
      }

      let adapaterClient = adapter.client
      let eventorigin = (
          event.stamp.indexOf &&
          event.stamp.indexOf('-') &&
          event.stamp.slice(0, event.stamp.indexOf('-'))
        ) || uuid
      if (adapaterClient && !event.upstream) {
        adapaterClient.send(this, adapter.parent, data, event)
      }
      // make this an option -- adapter.all
      // this part is not nessecary when its not my own event!
      if (adapter.parent.clients) {
        adapter.parent.clients.each((client, key) => {
          client = client.origin
          if (key !== eventorigin &&
            client !== event.client &&
            (!adapaterClient || client !== adapaterClient)
          ) {
            client.send(this, adapter.parent, data, event)
          } else {
            // console.log('6----', this.path, !!event.val, event.stamp, event.origin.path)
          }
        })
      }
    }
  }
}

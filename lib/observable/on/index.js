'use strict'
var uuid = require('vjs/lib/util/uuid').val

exports.on = {
  data: {
    adapter (data, event) {
      console.log('DATAX!')
      var adapter
      var parent = this
      // use lookup! (need this everywhere)
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

      // this is the send to all client function
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
